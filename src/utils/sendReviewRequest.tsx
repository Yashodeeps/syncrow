import { resend } from "../lib/resend";
import ReviewRequest from "../../emails/ReviewRequest";

export async function sendReviewRequest(
  email: string,
  name: string,
  link: string
) {
  try {
    await resend.emails.send({
      from: "verification@cosynclabs.com",
      to: email,
      subject: `${name} has requested a review from you`,
      react: ReviewRequest({ name, link }),
    });

    return { success: true, message: "review request send successfully" };
  } catch (emailError) {
    console.error(
      "error sending review request, try again after some time",
      emailError
    );
    return {
      success: false,
      message: "error sending review request, try again after some time",
    };
  }
}
