import React from "react";

export default function DeleteAccountPage() {
  return (
    <main className="container py-5">
      <div className="bg-light p-5 rounded shadow-sm back__style">
        <h1 className="fw-bold mb-4 text-center text-danger h1 text-capitalize">
          How to Delete Your Account
        </h1>

        <p className="lead">
          You can permanently delete your account and all associated data from
          within the app at any time. Follow the steps below to request
          deletion.
        </p>

        <ol className="fs-5 mt-4 mb-5">
          <li>
            Open the <strong className="text-danger">Cute live app</strong> on your device.
          </li>
          <li>
            Go to your <strong className="text-danger">Profile</strong> tab.
          </li>
          <li>
            Select <strong className="text-danger">Settings</strong>.
          </li>
          <li>
            Tap <strong className="text-danger">Delete Account</strong> at the bottom of the screen.
          </li>
          <li>Confirm the deletion when prompted.</li>
        </ol>

        <h2 className="h4 mb-3 fw-bold text-danger h1 text-capitalize">
          Example Screenshots
        </h2>
        <div className="border rounded p-4 mb-5 bg-white shadow-sm">
          <div className="row g-4 justify-content-center">
            <div className="col-md-4 col-sm-6 text-center">
              <img
                src="/delete-step-1.png"
                alt="Profile screen"
                className="img-fluid rounded shadow-sm"
              />
              <p className="mt-2 fw-medium text-danger">1. Open Profile</p>
            </div>
            <div className="col-md-4 col-sm-6 text-center">
              <img
                src="/delete-step-2.png"
                alt="Settings screen"
                className="img-fluid rounded shadow-sm"
              />
              <p className="mt-2 fw-medium text-danger">2. Go to Settings</p>
            </div>
            <div className="col-md-4 col-sm-6 text-center">
              <img
                src="/delete-step-3.png"
                alt="Delete account screen"
                className="img-fluid rounded shadow-sm"
              />
              <p className="mt-2 fw-medium text-danger">3. Tap Delete Account</p>
            </div>
          </div>
        </div>

        <h2 className="h3 fw-bold mb-3 text-danger h1">
          What Happens When You Delete Your Account
        </h2>
        <ul className="fs-5 mb-5">
          <li>
            All personal data associated with your account will be permanently
            deleted.
          </li>
          <li>Any content you created will also be removed.</li>
          <li>
            We may retain minimal data required for legal or security reasons
            for up to 30 days.
          </li>
        </ul>

        <p className="text-muted">
          If you experience any issues while deleting your account, contact our
          support team at{" "}
          <a
            href="mailto:support@yourdomain.com"
            className="text-decoration-underline text-danger"
          >
            support@yourdomain.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
