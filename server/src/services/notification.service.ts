// Notification service — email/push notifications
// In a real implementation, integrate with SendGrid/Twilio
export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
  // TODO: Integrate with email provider (SendGrid, etc.)
}

export async function notifySupervisor(supervisorId: string, message: string): Promise<void> {
  console.log(`[NOTIFY] Supervisor ${supervisorId}: ${message}`);
  // TODO: Push notification via FCM or WebSocket
}

export async function notifyStudent(studentId: string, message: string): Promise<void> {
  console.log(`[NOTIFY] Student ${studentId}: ${message}`);
}
