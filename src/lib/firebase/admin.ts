import { readFileSync } from 'node:fs';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function obtenerFirestore() {
  if (!getApps().length) {
    const ruta = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const json =
      process.env.FIREBASE_SERVICE_ACCOUNT ?? (ruta ? readFileSync(ruta, 'utf8') : undefined);
    if (!json) throw new Error('Faltan credenciales de Firebase Admin en el servidor.');
    const cuenta = JSON.parse(json) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };
    initializeApp({
      credential: cert({
        projectId: cuenta.project_id,
        clientEmail: cuenta.client_email,
        privateKey: cuenta.private_key,
      }),
      projectId: cuenta.project_id,
    });
  }
  return getFirestore(getApp());
}
