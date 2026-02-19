'use client';

import { 
  RosieCharacter, 
  ChesterCharacter, 
  PipCharacter, 
  VioletCharacter,
  RescueBunny 
} from '@/components/characters';

export default function CharactersTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🐰 Rescue Bunny Friends 🐰
        </h1>

        {/* Standing Poses */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Standing Poses
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <RosieCharacter size="medium" animated={true} pose="standing" />
              <p className="mt-2 font-semibold text-pink-600">Rosie</p>
              <p className="text-sm text-gray-600">Sweet & Gentle</p>
            </div>
            <div className="text-center">
              <ChesterCharacter size="medium" animated={true} pose="standing" />
              <p className="mt-2 font-semibold text-amber-700">Chester</p>
              <p className="text-sm text-gray-600">Confident & Friendly</p>
            </div>
            <div className="text-center">
              <PipCharacter size="medium" animated={true} pose="standing" />
              <p className="mt-2 font-semibold text-blue-600">Professor Pip</p>
              <p className="text-sm text-gray-600">Smart & Studious</p>
            </div>
            <div className="text-center">
              <VioletCharacter size="medium" animated={true} pose="standing" />
              <p className="mt-2 font-semibold text-purple-600">Violet</p>
              <p className="text-sm text-gray-600">Cool & Mysterious</p>
            </div>
          </div>
        </section>

        {/* Trapped Poses */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Trapped Poses (with cage bars)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <RosieCharacter size="medium" animated={true} pose="trapped" />
              <p className="mt-2 font-semibold text-pink-600">Rosie (Trapped)</p>
            </div>
            <div className="text-center">
              <ChesterCharacter size="medium" animated={true} pose="trapped" />
              <p className="mt-2 font-semibold text-amber-700">Chester (Trapped)</p>
            </div>
            <div className="text-center">
              <PipCharacter size="medium" animated={true} pose="trapped" />
              <p className="mt-2 font-semibold text-blue-600">Pip (Trapped)</p>
            </div>
            <div className="text-center">
              <VioletCharacter size="medium" animated={true} pose="trapped" />
              <p className="mt-2 font-semibold text-purple-600">Violet (Trapped)</p>
            </div>
          </div>
        </section>

        {/* Rescued Poses */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Rescued Poses (celebrating!)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <RosieCharacter size="medium" animated={true} pose="rescued" />
              <p className="mt-2 font-semibold text-pink-600">Rosie (Rescued!) 🎉</p>
            </div>
            <div className="text-center">
              <ChesterCharacter size="medium" animated={true} pose="rescued" />
              <p className="mt-2 font-semibold text-amber-700">Chester (Rescued!) 🎉</p>
            </div>
            <div className="text-center">
              <PipCharacter size="medium" animated={true} pose="rescued" />
              <p className="mt-2 font-semibold text-blue-600">Pip (Rescued!) 🎉</p>
            </div>
            <div className="text-center">
              <VioletCharacter size="medium" animated={true} pose="rescued" />
              <p className="mt-2 font-semibold text-purple-600">Violet (Rescued!) 🎉</p>
            </div>
          </div>
        </section>

        {/* Size Variations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Size Variations (Small, Medium, Large)
          </h2>
          <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <RosieCharacter size="small" animated={false} pose="standing" />
              <p className="mt-2 font-semibold">Small</p>
            </div>
            <div className="text-center">
              <RosieCharacter size="medium" animated={false} pose="standing" />
              <p className="mt-2 font-semibold">Medium</p>
            </div>
            <div className="text-center">
              <RosieCharacter size="large" animated={false} pose="standing" />
              <p className="mt-2 font-semibold">Large</p>
            </div>
          </div>
        </section>

        {/* RescueBunny Selector */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            RescueBunny Component (by index)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <RescueBunny index={0} size="medium" animated={true} pose="standing" />
              <p className="mt-2 font-semibold">Index 0: Rosie</p>
            </div>
            <div className="text-center">
              <RescueBunny index={1} size="medium" animated={true} pose="standing" />
              <p className="mt-2 font-semibold">Index 1: Chester</p>
            </div>
            <div className="text-center">
              <RescueBunny index={2} size="medium" animated={true} pose="standing" />
              <p className="mt-2 font-semibold">Index 2: Pip</p>
            </div>
            <div className="text-center">
              <RescueBunny index={3} size="medium" animated={true} pose="standing" />
              <p className="mt-2 font-semibold">Index 3: Violet</p>
            </div>
          </div>
        </section>

        {/* Level Assignment Info */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Level Assignments
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-bold text-pink-600">🌸 Rosie (Levels 1-3)</h3>
                <p className="text-sm text-gray-600">Meadow Zone - Daisy Field, Clover Patch, Butterfly Garden</p>
              </div>
              <div className="border-l-4 border-amber-600 pl-4">
                <h3 className="font-bold text-amber-700">🤙 Chester (Levels 4-6)</h3>
                <p className="text-sm text-gray-600">Forest Zone - Oak Grove, Mossy Hollow, Willow Creek</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-blue-600">📚 Professor Pip (Levels 7-8)</h3>
                <p className="text-sm text-gray-600">Cloud Zone - Cumulus Peaks, Sky Library</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-purple-600">💜 Violet (Levels 9-10)</h3>
                <p className="text-sm text-gray-600">Rainbow Zone - Prism Falls, Rainbow Summit</p>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center text-gray-600 mt-8">
          <p>Navigate to <code className="bg-gray-200 px-2 py-1 rounded">/</code> to return to the game</p>
        </div>
      </div>
    </div>
  );
}
