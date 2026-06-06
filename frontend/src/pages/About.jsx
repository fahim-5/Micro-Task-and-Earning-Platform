const About = () => {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Micro-Task and Earning Platform
          </h1>
          <p className="text-xl text-gray-600">
            A lightweight MERN-based platform to create and complete micro-tasks
            with secure payouts.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Roles & Features
            </h2>
            <ul className="space-y-3">
              <li>
                <strong>Worker:</strong> Browse tasks, submit proofs, earn
                coins, withdraw funds.
              </li>
              <li>
                <strong>Buyer:</strong> Create tasks, review submissions, pay
                Workers, purchase coins.
              </li>
              <li>
                <strong>Admin:</strong> Manage users, handle reports, and
                maintain system integrity.
              </li>
              <li>
                Responsive dashboard for all roles and role-based access
                control.
              </li>
              <li>
                Secure authentication, token-based sessions, and
                environment-based secrets.
              </li>
            </ul>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Getting Started
            </h2>
            <p className="text-gray-600 mb-4">
              Run the backend and frontend, set environment variables for
              secrets, then register as a Buyer or Worker to begin.
            </p>
            <p className="text-gray-600">
              Follow the README for setup and deployment instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
