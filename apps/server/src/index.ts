import { TRANSFER_FEE, WalletAccount, getAddressFromSignature } from '@fake-coin/wallet';
import { neon } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { validator } from 'hono/validator';
import { validatePayload } from './middlewares';
import { transferSchema, walletSignatureSchema } from './schemas';
import { Env } from './types';

const app = new Hono<Env>();

app.use(
  '/*',
  cors({
    origin: (_, c) => c.env.WEB_URL,
    allowMethods: ['GET', 'POST'],
  }),
);

app.get('/', (c) => c.text('Fake Coin is live!'));

app.notFound((c) => c.json({ ok: false, message: 'Not Found', details: 'Endpoint not found' }, 404));

const api = new Hono<Env>();

api.post('/init', validator('json', validatePayload(walletSignatureSchema)), async (c) => {
  try {
    const { message, messageHash, signature, recovery } = c.req.valid('json');
    const sql = neon(c.env.DATABASE_URL);

    const address = getAddressFromSignature(message, messageHash, signature, recovery);

    await sql`      
        INSERT INTO wallets (address, balance)
        VALUES (${address}, ${100});
      `;

    const wallet = (
      await sql`
        SELECT * FROM wallets WHERE address = ${address};
      `
    )[0] as WalletAccount | null;

    if (!wallet) {
      return c.json({ ok: false, message: 'Failed create wallet', details: 'Wallet not created on database' }, 404);
    }

    return c.json({
      ok: true,
      data: {
        address: wallet.address,
        balance: Number(wallet.balance),
        created_at: wallet.created_at,
      },
    });
  } catch (error: any) {
    return c.json({ ok: false, message: 'Internal Server Error', details: JSON.stringify(error) }, 500);
  }
});

api.post('/wallet', validator('json', validatePayload(walletSignatureSchema)), async (c) => {
  try {
    const { message, messageHash, signature, recovery } = c.req.valid('json');
    const sql = neon(c.env.DATABASE_URL);

    const address = getAddressFromSignature(message, messageHash, signature, recovery);

    const wallet = (
      await sql`
        SELECT * FROM wallets WHERE address = ${address};
      `
    )[0] as WalletAccount | null;

    if (!wallet) {
      return c.json({ ok: false, message: 'Not Found', details: 'Wallet not found' }, 404);
    }

    return c.json({
      ok: true,
      data: {
        address: wallet.address,
        balance: Number(wallet.balance),
        created_at: wallet.created_at,
      },
    });
  } catch (error: any) {
    return c.json({ ok: false, message: 'Internal Server Error', details: JSON.stringify(error) }, 500);
  }
});

api.post('/transfer', validator('json', validatePayload(transferSchema)), async (c) => {
  try {
    const { address, amount, message, messageHash, signature, recovery } = c.req.valid('json');
    const sql = neon(c.env.DATABASE_URL);
    const sqlQueries = [];

    const senderAddress = getAddressFromSignature(message, messageHash, signature, recovery);

    const senderWallet = (
      await sql`
        SELECT * FROM wallets WHERE address = ${senderAddress};
      `
    )[0] as WalletAccount | null;

    if (!senderWallet) {
      return c.json({ ok: false, message: 'Not Found', details: 'Sender wallet not found' }, 404);
    }

    if (senderWallet.balance < amount + TRANSFER_FEE) {
      return c.json({ ok: false, message: 'Insufficient Balance', details: 'Sender balance is not enough' }, 400);
    }

    const recipientWallet = (
      await sql`
        SELECT * FROM wallets WHERE address = ${address};
      `
    )[0] as WalletAccount | null;

    if (!recipientWallet) {
      sqlQueries.push(sql`      
        INSERT INTO wallets (address, balance)
        VALUES (${address}, ${0});
      `);
    }

    sqlQueries.push(sql`
        UPDATE wallets
        SET balance = ${Number(senderWallet.balance) - (amount + TRANSFER_FEE)}
        WHERE address = ${senderAddress};
      `);

    sqlQueries.push(sql`
        UPDATE wallets
        SET balance = ${Number(recipientWallet?.balance || 0) + amount}
        WHERE address = ${address};
      `);

    sql.transaction(sqlQueries);

    const updatedSenderWallet = (
      await sql`
          SELECT * FROM wallets WHERE address = ${senderAddress};
        `
    )[0] as WalletAccount | null;

    if (!updatedSenderWallet) {
      return c.json({ ok: false, message: 'Failed transfer coin', details: 'Wallet not updated on database' }, 404);
    }

    return c.json({
      ok: true,
      data: {
        address: updatedSenderWallet.address,
        balance: Number(updatedSenderWallet.balance),
        created_at: updatedSenderWallet.created_at,
      },
    });
  } catch (error: any) {
    return c.json({ ok: false, message: 'Internal Server Error', details: JSON.stringify(error) }, 500);
  }
});

app.route('/api/v1', api);

export default app;
