'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/contexts/I18nContext'
import { Search, MapPin, Calendar, Users, ArrowRight, Plane } from 'lucide-react'

export default function HomeHero() {
  const { t } = useI18n()
  return (
    <section 
      className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop')"
      }}
    >
      <div className="text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          {t('hero.headline', 'Discover Your Next Adventure')}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          {t('hero.subtitle', 'Explore breathtaking destinations and create unforgettable memories with our expertly curated travel experiences.')}
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-lg p-6 shadow-2xl max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <input
                type="text"
                placeholder={t('home.search.where', 'Where to?')}
                className="flex-1 outline-none text-gray-900"
              />
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-5 w-5" />
              <input
                type="date"
                className="flex-1 outline-none text-gray-900"
              />
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="h-5 w-5" />
              <select className="flex-1 outline-none text-gray-900">
                <option>2 Guests</option>
                <option>1 Guest</option>
                <option>3 Guests</option>
                <option>4+ Guests</option>
              </select>
            </div>
            <Button variant="gradient" className="h-12">
              <Search className="h-5 w-5 mr-2" />
              {t('actions.searchTours', 'Search Tours')}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="premium" size="xl">
            {t('actions.exploreTours', 'Explore Tours')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="xl" className="text-white border-white hover:bg-white hover:text-black backdrop-blur-sm">
            {t('actions.watchVideo', 'Watch Video')}
            <Plane className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}

