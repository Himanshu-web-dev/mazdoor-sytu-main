import { useEffect, useState } from 'react'

const aboutStats = [
  { value: 12, suffix: 'k+', label: 'people finding their next step', decimals: 0 },
  { value: 4.9, suffix: '', label: 'average community rating', decimals: 1 },
  { value: 24, suffix: '/7', label: 'support when work calls', decimals: 0 },
]

function AnimatedStat({ value, suffix, label, decimals }) {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentValue(value)
      return undefined
    }

    const animationStart = performance.now()
    const animationDuration = 1900
    let animationFrame
    const updateCounter = (currentTime) => {
      const progress = Math.min((currentTime - animationStart) / animationDuration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setCurrentValue(value * easedProgress)
      if (progress < 1) animationFrame = requestAnimationFrame(updateCounter)
    }

    animationFrame = requestAnimationFrame(updateCounter)
    return () => cancelAnimationFrame(animationFrame)
  }, [value])

  return <div><strong>{currentValue.toFixed(decimals)}{suffix}</strong><span>{label}</span></div>
}

const audiences = [
  ['For workers', 'Create your profile, show your skills, set your availability and find nearby jobs. Build trust through verification, ratings and your work history.'],
  ['For households', 'Find nearby workers for repairs, cleaning, construction and everyday help. Check profiles, book quickly and follow the job in real time.'],
  ['For businesses', 'Post requirements, find the right people and manage your workforce. Hire for one job or build a reliable team for the long run.'],
]

function About({ onNavigate }) {
  useEffect(() => {
    const revealItems = document.querySelectorAll('.about-reveal')
    if (!revealItems.length) return undefined

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' })

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="about-page">
      <section className="about-hero about-reveal">
        <div className="about-hero-copy"><p className="eyebrow">A simpler way to find and offer work</p><h1>Right work. Right people. <em>Right when you need them.</em></h1><p>Mazdoor Sytu connects skilled workers, households and businesses on one simple platform built for faster hiring and better opportunities.</p></div>
        <div className="about-seal"><span>MS</span><strong>Work that<br />moves people<br /><em>forward.</em></strong><small>EST. 2026 · INDIA</small></div>
      </section>
      <section className="about-statement about-reveal"><span className="about-number">01</span><div><p className="eyebrow">What Mazdoor Sytu does</p><h2>One place for people who need work and people who need help.</h2></div><p>We make traditional hiring easier with nearby worker discovery, real-time availability, instant booking, smart matching and clear communication.</p></section>
      <section className="audience-grid about-reveal" aria-label="Who Mazdoor Sytu is for">{audiences.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><a href={index === 0 ? '/worker/profile' : index === 1 ? '/workers' : '/business/requirements'}>Learn more <b>↗</b></a></article>)}</section>
      <section className="about-stats about-reveal" aria-label="Mazdoor Sytu community statistics">{aboutStats.map((stat) => <AnimatedStat key={stat.label} {...stat} />)}</section>
      <section className="realtime-section about-reveal"><div className="realtime-heading"><span className="about-number">02</span><p className="eyebrow">How booking works</p><h2>From “I need help” to “It’s booked.”</h2><p>See who is available, choose the right person and follow every update without chasing calls or messages.</p></div><div className="booking-steps"><article><span>01</span><div><strong>Share your need</strong><p>Tell us the service, place and time you need.</p></div></article><article><span>02</span><div><strong>Find the right worker</strong><p>Compare skills, ratings, availability and work history.</p></div></article><article><span>03</span><div><strong>Book and stay updated</strong><p>Get instant booking confirmation, live updates and support.</p></div></article></div></section>
      <section className="about-values about-reveal"><div className="about-section-label"><span>03</span><p className="eyebrow">What we believe</p><h2>Better work should create a better future.</h2><p className="about-values-intro">Our goal is not only to complete today’s job. We want to help workers grow and help customers find reliable support whenever they need it.</p></div><div className="values-list"><article><span>01</span><div><h3>Trust before the booking</h3><p>Verified profiles, ratings, reviews and work history help everyone make a confident decision.</p></div></article><article><span>02</span><div><h3>Opportunity for every skill</h3><p>Workers get a place to show what they can do, find better opportunities and build a professional reputation.</p></div></article><article><span>03</span><div><h3>A growing worker ecosystem</h3><p>Training, certification, safety equipment, insurance partnerships and long-term career opportunities are part of the road ahead.</p></div></article></div></section>
      <section className="about-quote about-reveal"><p>“Our mission is simple: make work easier to find, easier to trust and easier to grow through.”</p><span>— The Mazdoor Sytu team</span></section>
      <section className="leadership-section about-reveal">
        <div className="leadership-intro">
          <span className="about-number">04</span>
          <p className="eyebrow">Leadership</p>
          <h2>Built by people who understand the realities of real work.</h2>
        </div>
        <div className="leadership-profile-card">
          <div className="leadership-portrait-wrap founder-portrait-wrap">
            <img src="/founder-ceo-portrait.webp" alt="Founder & CEO portrait" width="400" height="400" loading="lazy" decoding="async" />
          </div>
          <div className="leadership-profile-copy">
            <p className="profile-role">FOUNDER & CEO</p>
            <h3>Parwat Kumar</h3>
            <p>Parwat Kumar leads Mazdoor Sytu with a mission to simplify access to dependable daily work, safe opportunities and trusted service networks across India.</p>
            <ul>
              <li>Driving the platform with a worker-first vision</li>
              <li>Building trust, access and opportunity at scale</li>
              <li>Turning everyday service gaps into organized digital access</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="leadership-section about-reveal second-leadership-row">
        <div className="leadership-intro secondary-leadership-intro">
          <span className="about-number">05</span>
          <p className="eyebrow">Technology</p>
          <h2>Building the systems that make the marketplace work smoothly.</h2>
        </div>
        <div className="leadership-profile-card tech-leadership-card">
          <div className="leadership-portrait-wrap director-portrait-wrap">
            <img src="/director-cto-portrait.webp" alt="Director & CTO portrait" width="400" height="400" loading="lazy" decoding="async" />
          </div>
          <div className="leadership-profile-copy">
            <p className="profile-role">DIRECTOR & CTO</p>
            <h3>Shubham</h3>
            <p>Shubham shapes the platform’s technical roadmap, product reliability and operational scale — ensuring workers, customers and businesses experience a smooth digital journey.</p>
            <ul>
              <li>Designing systems that power the booking experience</li>
              <li>Building modern infrastructure for trust and speed</li>
              <li>Aligning product, operations and technology for scale</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="leadership-section about-reveal second-leadership-row">
        <div className="leadership-intro secondary-leadership-intro">
          <span className="about-number">06</span>
          <p className="eyebrow">Growth</p>
          <h2>Creating trust, visibility and momentum that help the whole ecosystem grow.</h2>
        </div>
        <div className="leadership-profile-card tech-leadership-card">
          <div className="leadership-portrait-wrap cofounder-portrait-wrap">
            <img src="/cofounder-cmo-portrait.webp" alt="CO-FOUNDER & CMO portrait" width="400" height="400" loading="lazy" decoding="async" />
          </div>
          <div className="leadership-profile-copy">
            <p className="profile-role">CO-FOUNDER & CMO</p>
            <h3>Sambhav Singh Sengar</h3>
            <p>Sambhav Singh Sengar leads growth, brand trust and customer experience strategy, bringing structure to how Mazdoor Sytu connects workers with opportunities.</p>
            <ul>
              <li>Building stronger trust across every customer touchpoint</li>
              <li>Driving community-led demand and long-term retention</li>
              <li>Turning everyday service access into a visible, credible brand</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="about-cta"><div><p className="eyebrow">Your next step starts here</p><h2>Let’s get good work moving.</h2></div><button className="primary-button" type="button" onClick={() => onNavigate('/workers')}>Explore the community <span>↗</span></button></section>
    </div>
  )
}

export default About
