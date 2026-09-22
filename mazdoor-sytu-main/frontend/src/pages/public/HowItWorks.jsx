const workflows = [
 	{
 		number: '01',
 		icon: '👷',
 		title: 'For workers',
 		intro: 'Show your skills, find nearby work and build a professional reputation.',
 		steps: [
 			['Create your profile', 'Register with your mobile number and add your name, skills, experience and location.'],
 			['Set your availability', 'When you are ready to work, switch your status to “Available”.'],
 			['Respond to requests', 'Review requests from nearby customers or businesses and accept or decline them.'],
 			['Complete the job', 'Connect with the customer, reach the location, finish the work and receive your payment.'],
 		],
 	},
 	{
 		number: '02',
 		icon: '🏠',
 		title: 'For customers',
 		intro: 'Find trusted help for your home, compare workers and book in minutes.',
 		steps: [
 			['Choose a service', 'Select an Electrician, Plumber, Carpenter, Painter or the service you need.'],
 			['Add your location', 'Share your location to see available workers nearby.'],
 			['Compare workers', 'Review names, photos, skills, experience and ratings before choosing.'],
 			['Book and track', 'Send a booking request, speak with the worker and follow the job status.'],
 		],
 	},
 	{
 		number: '03',
 		icon: '🏢',
 		title: 'For businesses',
 		intro: 'Make hiring simple and manageable, from one worker to an entire team.',
 		steps: [
 			['Post a requirement', 'Tell us how many workers you need and which skills are required, such as 10 Helpers or 5 Electricians.'],
 			['Discover suitable workers', 'Mazdoor Sytu shows available workers who match your requirement.'],
 			['Select and hire', 'Compare profiles, experience and availability to build the right team.'],
 			['Manage your workforce', 'Keep bookings, communication, payments and worker performance in one place.'],
 		],
 	},
]

function HowItWorks({ onNavigate }) {
 	return (
 		<div className="how-page">
 			<section className="how-hero">
 				<div><p className="eyebrow">Simple. Local. Reliable.</p><h1>Finding and offering work is <em>now easier.</em></h1><p>Mazdoor Sytu connects workers, households and businesses on one simple real-time platform.</p></div>
 				<div className="how-hero-note"><span>01—03</span><strong>Choose your journey.<br />We’ll help with the rest.</strong></div>
 			</section>
 			<div className="Setu-marquee" aria-label="Mazdoor Sytu platform"><div className="Setu-marquee-track"><div className="Setu-marquee-group"><span>Mazdoor Sytu <b>✳</b></span><span>Mazdoor Sytu <b>✳</b></span><span>Mazdoor Sytu <b>✳</b></span><span>Mazdoor Sytu <b>✳</b></span></div><div className="Setu-marquee-group" aria-hidden="true"><span>Mazdoor Sytu <b>✳</b></span><span>Mazdoor Sytu <b>✳</b></span><span>Mazdoor Sytu <b>✳</b></span><span>Mazdoor Sytu <b>✳</b></span></div></div></div>
 			<section className="how-workflows">{workflows.map((workflow) => <article className="workflow-card" key={workflow.title}><header><span className="workflow-number">{workflow.number}</span><span className="workflow-icon" aria-hidden="true">{workflow.icon}</span><h2>{workflow.title}</h2><p>{workflow.intro}</p></header><div className="workflow-steps">{workflow.steps.map(([title, text], index) => <div className="workflow-step" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></article>)}</section>
 			<section className="journey-strip"><p className="eyebrow">The journey at a glance</p><h2>Available worker <b>→</b> Nearby match <b>→</b> Booking <b>→</b> Job complete <b>→</b> Payment and rating</h2></section>
 			<section className="how-trust"><div><p className="eyebrow">Confidence at every step</p><h2>Better connections, better work.</h2></div><div className="trust-points"><p><strong>Real-time availability</strong> See only workers who are ready to work right now.</p><p><strong>Verified profiles</strong> Review skills, experience, ratings and work history before booking.</p><p><strong>Clear communication</strong> Get updates in one place from booking to completion.</p></div></section>
 			<section className="how-cta"><div><p className="eyebrow">Ready when you are</p><h2>Take your next step today.</h2></div><div className="how-cta-actions"><button className="how-cta-primary" type="button" onClick={() => onNavigate('/workers')}><span>Find a worker</span><em>↗</em></button><button className="how-cta-secondary" type="button" onClick={() => onNavigate('/signup')}>Join Mazdoor Sytu</button></div></section>
 		</div>
 	)
}

export default HowItWorks
