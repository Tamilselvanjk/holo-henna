import React from 'react'
import './WhyChooseUs.css'

const WhyChooseUs = () => {
  const cards = [
    {
      img: './webimg/experience.png',
      title: 'Expertise and Experience',
      text: 'With a decade of experience, our Mehndi artistry combines traditional techniques with contemporary designs...',
    },
    {
      img: './webimg/customize.jpg',
      title: 'Customized Designs',
      text: "We offer personalized Mehndi designs tailored to each client's preferences...",
    },
    {
      img: './webimg/quality.png',
      title: 'Quality Ingredients',
      text: 'Our commitment to quality is reflected in the use of 100% natural henna...',
    },
    {
      img: './webimg/timeseries.png',
      title: 'Timely Services',
      text: 'We value your time and guarantee prompt service delivery...',
    },
    {
      img: './webimg/desginExplore.png',
      title: 'Design Exploration & Trial',
      text: 'Before applying Mehndi, we engage in an in-depth design exploration...',
    },
  ]

  return (
    <section className="why-choose-us" id="why-choose-us">
      <div className="container">
        <div className="section-title">
          <h2>WHY CHOOSE US?</h2>
          <p>Discover what makes our mehndi services stand out from the rest</p>
        </div>

        <div className="cards-container">
          {cards.slice(0, 3).map((card, index) => (
            <div className="card" key={index}>
              <img src={card.img} alt={card.title} />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}

          <div className="half-width-container">
            {cards.slice(3).map((card, index) => (
              <div className="card half-width" key={index}>
                <img src={card.img} alt={card.title} />
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
