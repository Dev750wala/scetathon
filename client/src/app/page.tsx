import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Swachh Campus 360</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Sign In
            </Link>
            <Link href="/auth/register" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span>🏆</span>
          <span>SCET Hackathon Project</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Smarter Campus.<br />
          <span className="text-green-600">Cleaner Campus.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          AI-powered sanitation intelligence for SCET campus. Report issues, track resolutions,
          and keep our campus spotless — together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register?role=STUDENT" className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg">
            Report an Issue
          </Link>
          <Link href="/dashboard" className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg border border-gray-200">
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">For Every Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((r) => (
              <Link key={r.role} href={`/auth/login`} className="block p-6 rounded-2xl border-2 hover:border-green-500 transition-colors bg-gray-50 hover:bg-green-50">
                <div className="text-2xl mb-3">{r.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{r.role}</h3>
                <p className="text-gray-600 text-sm">{r.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>Built with ❤️ for SCET Hackathon · Swachh Campus 360</p>
      </footer>
    </main>
  );
}

const features = [
  { icon: '🤖', title: 'AI-Powered Deduplication', description: 'Smart similarity detection merges duplicate reports automatically, reducing noise in the system.' },
  { icon: '🗺️', title: 'Campus Digital Twin', description: 'Real-time heatmap showing cleanliness scores for every zone on campus with entropy decay model.' },
  { icon: '🔐', title: 'Tamper-proof Audit Trail', description: 'SHA-256 hash-chained ledger ensures complete accountability for every action in the system.' },
  { icon: '🎙️', title: 'Voice Reporting', description: 'Report issues in English, Hindi, or Gujarati using your voice. AI translates and classifies automatically.' },
  { icon: '📊', title: 'Analytics Dashboard', description: 'PIC gets comprehensive KPIs, trends, worker performance, and AI-generated insights.' },
  { icon: '📱', title: 'QR Zone Scanning', description: 'Quick complaint submission by scanning QR codes placed at each campus zone.' },
];

const roles = [
  { icon: '🎓', role: 'Student', description: 'Report sanitation issues using text, voice, or photo. Track your report status in real-time.' },
  { icon: '👷', role: 'Supervisor', description: 'Review incoming reports, assign workers, track job progress, and verify resolutions.' },
  { icon: '👨‍💼', role: 'Professor-In-Charge', description: 'Monitor campus-wide analytics, heatmaps, AI insights, and the complete audit trail.' },
];
