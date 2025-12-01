import NotFoundAnimation from "@/components/shared/NotFoundAnimation";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className='error-container'>
      <div className='lottie-animation'>
        <NotFoundAnimation />
      </div>

      <div className='error-content'>
        <h1>404</h1>
        <p>Oops! Page is not found</p>

        <Link href='/' className='btn-home'>
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}
