'use client'

import { useState } from 'react'

export default function CompetitorForm({ brandId, onAdded }: { brandId: string, onAdded: () => void }) {
  const [formData, setFormData] = useState({
    competitor_name: '',
    competitor_domain: '',
    region: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, brand_id: brandId }),
      })
      setFormData({ competitor_name: '', competitor_domain: '', region: '' })
      onAdded()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={formData.competitor_name}
        onChange={(e) => setFormData({ ...formData, competitor_name: e.target.value })}
        placeholder="Competitor Name"
        className="w-full px-3 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        value={formData.competitor_domain}
        onChange={(e) => setFormData({ ...formData, competitor_domain: e.target.value })}
        placeholder="competitor.com"
        className="w-full px-3 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        value={formData.region}
        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
        placeholder="Region"
        className="w-full px-3 py-2 border rounded-lg"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
      >
        Add Competitor
      </button>
    </form>
  )
}
