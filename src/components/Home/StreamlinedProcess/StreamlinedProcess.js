import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faComments, 
  faFileInvoiceDollar, 
  faPaintBrush, 
  faHandshake 
} from '@fortawesome/free-solid-svg-icons'
import './StreamlinedProcess.css'

const StreamlinedProcess = () => {
const steps = [
    {
      icon: faComments,
      title: 'Initial Consultation',
      description: 'Discuss design preferences, event details & share references if you have a specific style in mind.'
    },
    {
      icon: faFileInvoiceDollar,
      title: 'Quotation and Assignment',
      description: 'Get a clear quote and pay 25% advance once you\'re satisfied with the terms and pricing.'
    },
    {
      icon: faPaintBrush,
      title: 'Design Preparation',
      description: 'Get a customization checklist & sketch preview (for selected packages) before the final day.'
    },
    {
      icon: faHandshake,
      title: 'Service Execution',
      description: 'Design is applied on event day. We provide aftercare & follow up for your full satisfaction.'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
          }
        })
      },
      { threshold: 0.1 }
    )

const steps = document.querySelectorAll('.step')
    steps.forEach(step => observer.observe(step))

    return () => {
      steps.forEach(step => observer.unobserve(step))
    }
  }, [])

  return (
    <section className="streamlined-process">
      <div className="overview-container">
        <div className="section-title">
          <h2>STREAMLINED MEHNDI SERVICE PROCESS</h2>
          <p>Discover our streamlined process for delivering exceptional mehndi services:</p>
        </div>
       
<div className="overview-steps">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="step"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="step-icon">
                <FontAwesomeIcon icon={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StreamlinedProcess
