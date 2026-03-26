import QRCode from "qrcode";

export async function generateQRCode(data: string): Promise<string> {
  return QRCode.toDataURL(data, {
    errorCorrectionLevel: "H",
    type: "image/png",
    margin: 1,
    color: { dark: "#000000", light: "#FFFFFF" },
    width: 256,
  });
}

export function getTicketUrl(ticketNumber: string): string {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base}/kiosk/${ticketNumber}`;
}
