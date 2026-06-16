class EmailService:
    @staticmethod
    async def send_notification(to_email: str, subject: str, body: str) -> bool:
        print(f"""
        ╔══════════════════════════════════════╗
        ║ 📧 EMAIL NOTIFICATION               ║
        ╠══════════════════════════════════════╣
        ║ To: {to_email:<30} ║
        ║ Subject: {subject:<26} ║
        ╚══════════════════════════════════════╝
        """)
        return True

    @staticmethod
    async def send_application_confirmation(user_email: str, job_title: str, company: str):
        return await EmailService.send_notification(user_email, f"Application: {job_title} at {company}", "Submitted!")

    @staticmethod
    async def send_daily_summary(user_email: str, stats: dict):
        return await EmailService.send_notification(user_email, "Daily Summary", str(stats))