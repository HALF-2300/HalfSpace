'use client'

import { useState } from 'react'
import spaceOrgs from '@/data/spaceOrganizations.json'

export default function SpaceOrganizations() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)

  const { organizations, recentMajorDiscoveries } = spaceOrgs

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-3">
          🌍 Global Space Exploration
        </h2>
        <p className="text-gray-400 text-lg">
          Discoveries from space agencies around the world
        </p>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
        {organizations.map((org) => (
          <button
            key={org.id}
            onClick={() => setSelectedOrg(selectedOrg === org.id ? null : org.id)}
            className={`glass rounded-xl p-4 border transition-all hover:scale-105 ${
              selectedOrg === org.id
                ? 'border-purple-500 bg-purple-600/20'
                : 'border-purple-500/30 hover:border-purple-500/60'
            }`}
          >
            <div className="text-3xl mb-2">{org.icon}</div>
            <div className="text-xl font-bold text-white mb-1">{org.name}</div>
            <div className="text-xs text-gray-400">{org.flag} {org.country}</div>
          </button>
        ))}
      </div>

      {/* Selected Organization Details */}
      {selectedOrg && (
        <div className="glass rounded-2xl border border-purple-500/30 p-6 mb-12 animate-fadeIn">
          {organizations
            .filter((org) => org.id === selectedOrg)
            .map((org) => (
              <div key={org.id}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{org.icon}</div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {org.fullName}
                    </h3>
                    <p className="text-gray-300 mb-2">{org.description}</p>
                    <p className="text-sm text-gray-500">
                      Founded: {org.founded} | {org.flag} {org.country}
                    </p>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-purple-400 mb-4">
                  Recent Discoveries & Missions
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {org.recentDiscoveries.map((discovery, idx) => (
                    <div
                      key={idx}
                      className="bg-black/40 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                    >
                      <div className="text-sm text-purple-400 font-semibold mb-2">
                        {discovery.date}
                      </div>
                      <h5 className="text-white font-bold mb-2">
                        {discovery.title}
                      </h5>
                      <p className="text-sm text-gray-400">
                        {discovery.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Recent Major Discoveries */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-white mb-6 text-center">
          🔭 Recent Major Discoveries
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentMajorDiscoveries.slice(0, 6).map((discovery, idx) => (
            <div
              key={idx}
              className="glass rounded-xl border border-blue-500/30 p-5 hover:border-blue-500/60 transition-all hover:scale-105"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-blue-400 font-semibold">
                  {discovery.organization}
                </span>
                <span className="text-xs text-gray-500">{discovery.date}</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                {discovery.title}
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                {discovery.description}
              </p>
              <div className="text-xs text-purple-300 italic">
                💡 {discovery.significance}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Missions */}
      <div>
        <h3 className="text-3xl font-bold text-white mb-6 text-center">
          🚀 Upcoming Missions
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaceOrgs.upcomingMissions.map((mission, idx) => (
            <div
              key={idx}
              className="glass rounded-xl border border-orange-500/30 p-4 hover:border-orange-500/60 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{mission.icon}</span>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {mission.mission}
                  </h4>
                  <div className="text-xs text-gray-400">
                    {mission.organization}
                  </div>
                </div>
              </div>
              <div className="text-sm text-orange-400 mb-2">
                🗓️ {mission.launch}
              </div>
              <div className="text-sm text-gray-300 mb-1">
                <strong>Target:</strong> {mission.target}
              </div>
              <p className="text-xs text-gray-400">{mission.goal}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
