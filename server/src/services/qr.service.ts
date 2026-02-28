import QRCode from 'qrcode';

export async function generateZoneQR(zoneId: string, baseUrl: string): Promise<string> {
  const url = `${baseUrl}/scan/${zoneId}`;
  const dataUrl = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: '#1a1a1a', light: '#ffffff' },
  });
  return dataUrl;
}

export async function generateZoneQRBuffer(zoneId: string, baseUrl: string): Promise<Buffer> {
  const url = `${baseUrl}/scan/${zoneId}`;
  return QRCode.toBuffer(url, { width: 300 });
}
