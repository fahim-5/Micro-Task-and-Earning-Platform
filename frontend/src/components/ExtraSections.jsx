export default function ExtraSections() {
  return (
    <>
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-6">
              <h4 className="font-semibold">Browse Tasks</h4>
              <p className="text-sm text-gray-600">
                Find tasks that match your skills and start earning.
              </p>
            </div>
            <div className="card p-6">
              <h4 className="font-semibold">Submit Proof</h4>
              <p className="text-sm text-gray-600">
                Upload evidence of completion for buyer review.
              </p>
            </div>
            <div className="card p-6">
              <h4 className="font-semibold">Get Paid</h4>
              <p className="text-sm text-gray-600">
                Approved submissions add coins to your wallet instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Platform Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-6">Role-based access control</div>
            <div className="card p-6">Secure payments & withdrawals</div>
            <div className="card p-6">Responsive dashboards</div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Join Today</h3>
          <p className="text-gray-600 mb-4">
            Register as a Worker or Buyer and start earning or posting tasks.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/register" className="btn-primary">
              Register
            </a>
            <a href="/login" className="btn-secondary">
              Login
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
