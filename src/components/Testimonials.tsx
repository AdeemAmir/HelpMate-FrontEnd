'use client'

import { StarIcon } from '@heroicons/react/24/solid'

const testimonials = [
  {
    id: 1,
    content: "HealthMate has been a game-changer for our family. Finally, we can understand our medical reports in simple language. The Roman Urdu explanations are so helpful!",
    author: {
      name: 'Ayesha Khan',
      role: 'Mother of 3',
      location: 'Lahore, Pakistan',
      image: 'AK',
    },
    rating: 5,
  },
  {
    id: 2,
    content: "As a doctor, I recommend HealthMate to my patients. It helps them understand their reports better and ask the right questions during consultations.",
    author: {
      name: 'Dr. Ahmed Hassan',
      role: 'General Physician',
      location: 'Karachi, Pakistan',
      image: 'AH',
    },
    rating: 5,
  },
  {
    id: 3,
    content: "I love how I can track my blood pressure and sugar levels over time. The AI insights help me understand my health trends better.",
    author: {
      name: 'Muhammad Ali',
      role: 'Business Owner',
      location: 'Islamabad, Pakistan',
      image: 'MA',
    },
    rating: 5,
  },
  {
    id: 4,
    content: "The security and privacy features give me peace of mind. I know my health data is safe and only accessible to me.",
    author: {
      name: 'Fatima Sheikh',
      role: 'Teacher',
      location: 'Rawalpindi, Pakistan',
      image: 'FS',
    },
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <div id="testimonials" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What our users say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of families who trust HealthMate with their health data.
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              
              <blockquote className="text-gray-700 mb-6">
                "{testimonial.content}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {testimonial.author.image}
                  </span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {testimonial.author.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.author.role} • {testimonial.author.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats */}
        <div className="mt-16 bg-white rounded-2xl p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">10,000+</div>
              <div className="mt-2 text-sm text-gray-600">Reports Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">5,000+</div>
              <div className="mt-2 text-sm text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">99.9%</div>
              <div className="mt-2 text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
