import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="ra-container mx-auto">
      <section className="ra-hero p-5 p-md-6 mb-4">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <h1 className="display-5 title">Cook Smarter with Sous Duckling</h1>
            <p className="lead mb-4 subtitle">Your ultimate recipe companion. Ask for any dish, get tailored ingredients and steps, and adapt to dislikes on the fly.</p>
            <div className="d-flex gap-2">
              {/* Start Chatting and Learn More both navigate to /chat and use visible blue CTA with white text */}
              <Link to="/chat" className="btn btn-primary btn-lg">Start Chatting</Link>
              <Link to="/chat" className="btn btn-primary btn-lg">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="row g-4">
        <div className="col-md-4">
          <div className="card-ra p-4 h-100">
            <h5>Instant Recipes</h5>
            <p className="mb-0">“recipe for lasagna” → get ingredients and clear steps, instantly.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-ra p-4 h-100">
            <h5>Adaptive Substitutions</h5>
            <p className="mb-0">“I don’t like mushrooms” → recipe regenerates to match your taste.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-ra p-4 h-100">
            <h5>Keep the Flow</h5>
            <p className="mb-0">The chat keeps context so you can iterate without repeating yourself.</p>
          </div>
        </div>
      </section>
    </div>
  )
}