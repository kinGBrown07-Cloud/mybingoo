'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PlaySuperLotButton from '@/components/PlaySuperLotButton';
import {
  PlayIcon,
  GiftIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  TrophyIcon,
  CheckCircleIcon,
  CurrencyEuroIcon,
  ArrowRightIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  EnvelopeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { id: 1, name: 'Points par partie', value: '2 pts', icon: CurrencyDollarIcon },
  { id: 2, name: 'Valeur du point', value: '300 FCFA', icon: CurrencyEuroIcon },
  { id: 3, name: 'Lots disponibles', value: '100+', icon: GiftIcon },
  { id: 4, name: 'Gagnants par mois', value: '50+', icon: TrophyIcon },
];

export default function Home() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-700 overflow-x-hidden">
      {/* Hero Section avec animation */}
      <div className="relative w-full min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-700 overflow-hidden">
        {/* Background avec motifs et animations */}
        <div className="absolute inset-0 z-0">
          {/* Gradient de base */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/30 via-red-600/50 to-red-800/70" />
          
          {/* Cercles flottants */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-200/10"
                style={{
                  width: Math.random() * 200 + 100 + 'px',
                  height: Math.random() * 200 + 100 + 'px',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: Math.random() * 3 + 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>

          {/* Étoiles scintillantes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>

          {/* Particules flottantes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 50 - 25, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-full blur-sm" />
              </motion.div>
            ))}
          </motion.div>

          {/* Effet de lumière radial */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full bg-gradient-radial from-yellow-400/20 via-yellow-400/5 to-transparent rounded-full blur-3xl transform -translate-y-1/2" />
          </motion.div>
        </div>

        {/* Contenu animé */}
        <div className="relative z-10 w-full min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Colonne de gauche - Texte */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 relative"
              >
                {/* Effet de brillance derrière le titre */}
                <div className="absolute -top-20 -left-20 w-[140%] h-[140%] bg-gradient-radial from-yellow-400/20 via-red-500/5 to-transparent blur-3xl" />

                {/* Badge avec effet de brillance */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400/30 to-yellow-500/20 text-yellow-300 text-sm font-medium backdrop-blur-sm border border-yellow-400/30 relative overflow-hidden shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-300/5" />
                  <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2 relative z-10"></span>
                  <span className="relative z-10">Bingoo Tombola</span>
                </motion.div>

                {/* Titre principal avec effet de brillance */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white relative"
                >
                  <span className="relative">
                    Votre chance de
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-transparent blur-lg" />
                  </span>
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                    gagner gros
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-yellow-100/90 max-w-lg"
                >
                  Participez à notre tombola et tentez de remporter des lots exceptionnels. Une partie ne coûte que 2 points (300 FCFA).
                </motion.p>

                {/* Badges info */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-4 text-sm text-yellow-100/80"
                >
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    2 Points
                  </div>
                  <div className="flex items-center">
                    <GiftIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    Lots Premium
                  </div>
                </motion.div>

                {/* Boutons d'action */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 pt-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PlaySuperLotButton />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/prizes"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-yellow-400/50 text-yellow-400 font-medium hover:bg-yellow-400/10 transition-colors w-full sm:w-auto backdrop-blur-sm"
                    >
                      Voir les lots
                      <GiftIcon className="h-5 w-5 ml-2" />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Colonne de droite - Vidéo */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative w-full max-w-3xl mx-auto lg:max-w-none"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 backdrop-blur-sm border border-yellow-400/20">
                    <button 
                      onClick={toggleVideo}
                      className="absolute top-4 right-4 z-10"
                    >
                      <div className="bg-yellow-400/90 backdrop-blur rounded-full p-2 shadow-lg hover:bg-yellow-400 transition-colors">
                        <PlayIcon className="h-6 w-6 text-red-700" />
                      </div>
                    </button>
                    <video
                      ref={videoRef}
                      className="w-full aspect-[16/9] object-cover"
                      playsInline
                      controls
                    >
                      <source src="/videos/bingoo.mp4" type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  </div>
                </motion.div>

                {/* Flèche décorative */}
                <div className="absolute -right-10 -bottom-96">
                  <Image
                    src="/images/arrow.png"
                    alt="Flèche décorative"
                    width={500}
                    height={500}
                    className="opacity-90"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Lot du moment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/20 via-red-900/95 to-red-800/95 backdrop-blur-sm border border-emerald-500/20">
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent"
                animate={{
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Image de la moto */}
                <div className="relative w-full lg:w-1/2">
                  <div className="relative rounded-xl overflow-hidden group">
                    <Image
                      src="/images/prizes/current/motorcycle.png"
                      alt="Moto à gagner"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                {/* Flèche décorative */}
                <div className="relative">
                  <div className="absolute right-32 -mt-24">
                    <Image
                      src="/images/arrow.png"
                      alt="Flèche décorative"
                      width={500}
                      height={500}
                      className="opacity-90"
                    />
                  </div>
                </div>

                {/* Description du lot */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400/30 to-yellow-500/20 text-yellow-300 text-sm font-medium backdrop-blur-sm border border-yellow-400/30"
                    >
                      <span className="relative">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 absolute -left-4 top-1/2 -translate-y-1/2" />
                        Lot du Moment
                      </span>
                    </motion.div>
                  </div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-3xl sm:text-4xl font-bold text-white"
                  >
                    Gagnez une Moto
                    <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                      Scooter Neuve
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg text-yellow-100/80"
                  >
                    Participez à notre tombola et tentez de remporter ce magnifique scooter. Livré avec casque et accessoires.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2 text-yellow-100/90">
                      <CheckCircleIcon className="h-5 w-5 text-yellow-400" />
                      <span>Scooter neuf</span>
                    </div>
                    <div className="flex items-center space-x-2 text-yellow-100/90">
                      <CheckCircleIcon className="h-5 w-5 text-yellow-400" />
                      <span>Casque inclus</span>
                    </div>
                    <div className="flex items-center space-x-2 text-yellow-100/90">
                      <CheckCircleIcon className="h-5 w-5 text-yellow-400" />
                      <span>Garantie 1 an</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="pt-6"
                  >
                    <Link
                      href="/play"
                      className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-colors duration-300 shadow-lg shadow-yellow-400/20"
                    >
                      Jouer maintenant
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section des statistiques */}
        <div className="bg-gradient-to-b from-red-600 to-red-700 py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="relative z-20"
            >
              <dl className="rounded-lg bg-white/10 backdrop-blur-lg shadow-lg sm:grid sm:grid-cols-2 lg:grid-cols-4 border border-white/20">
                {stats.map((stat, statIdx) => (
                  <div
                    key={stat.id}
                    className={`relative bg-white/5 p-6 ${
                      statIdx < stats.length - 1 ? 'border-b sm:border-r border-white/10' : ''
                    }`}
                  >
                    <dt>
                      <div className="absolute bg-red-500 rounded-md p-3">
                        <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-sm font-medium text-white truncate">{stat.name}</p>
                    </dt>
                    <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                      <p className="text-2xl font-semibold text-yellow-400">{stat.value}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 space-y-8 py-12">
          {/* Lots du moment */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-900/20 via-red-900/95 to-red-800/95 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-emerald-500/20 mt-12"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="lg:text-center mb-12">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-base text-yellow-400 font-semibold tracking-wide uppercase flex items-center justify-center"
                >
                  <GiftIcon className="h-6 w-6 mr-2" />
                  Lots du moment
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl"
                >
                  <span className="text-emerald-400">Lots disponibles</span> cette semaine
                </motion.p>
                <p className="mt-4 max-w-2xl text-base text-yellow-100/90 lg:mx-auto font-medium">
                  Tentez votre chance pour gagner ces lots exceptionnels avec seulement <span className="text-emerald-400 font-semibold">2 points</span> par tirage
                </p>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 gap-y-20 sm:grid-cols-2 gap-x-8 lg:grid-cols-3 px-8"
              >
                {[
                  {
                    image: '/images/prizes/food-kits/rice.png',
                    title: 'Kit Alimentaire',
                    description: 'Un sac de riz de 50kg + 5L d\'huile + assortiments',
                    category: 'Kit Alimentaire',
                    color: 'emerald'
                  },
                  {
                    image: '/images/prizes/clothing/watch.png',
                    title: 'Montre de Luxe',
                    description: 'Une montre élégante pour homme ou femme',
                    category: 'Habillement',
                    color: 'red'
                  },
                  {
                    image: '/images/prizes/super-prizes/motorcycle.png',
                    title: 'Moto Scooter',
                    description: 'Un scooter neuf avec casque et accessoires',
                    category: 'Super Lot',
                    color: 'yellow'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="group relative w-full px-6"
                  >
                    <Link href={
                      item.category === 'Kit Alimentaire' ? '/play/afrique-noire' :
                      item.category === 'Habillement' ? '/play/afrique-blanche' :
                      '/play/europe'
                    } className="block">
                      <div className="relative w-full h-96 -mt-12 mb-8 overflow-visible">
                        <Image
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                          width={600}
                          height={400}
                          style={{
                            marginLeft: '-10%',
                            width: '120%',
                            maxWidth: '120%'
                          }}
                        />
                        <div className={`absolute top-4 right-0 m-2 ${
                          item.color === 'emerald' ? 'bg-emerald-500' :
                          item.color === 'red' ? 'bg-red-500' :
                          'bg-yellow-400'
                        } rounded-full p-1 shadow-lg`}>
                          <StarIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className={`bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border ${
                        item.color === 'emerald' ? 'border-emerald-100 hover:border-emerald-300' :
                        item.color === 'red' ? 'border-red-100 hover:border-red-300' :
                        'border-yellow-100 hover:border-yellow-300'
                      } relative w-[120%] -ml-[10%]`}>
                        <div className={`absolute -top-4 left-8 ${
                          item.color === 'emerald' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' :
                          item.color === 'red' ? 'bg-gradient-to-r from-red-600 to-red-500' :
                          'bg-gradient-to-r from-yellow-500 to-yellow-400'
                        } text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg`}>
                          {item.category}
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                          <div className={`h-px bg-gradient-to-r ${
                            item.color === 'emerald' ? 'from-emerald-200' :
                            item.color === 'red' ? 'from-red-200' :
                            'from-yellow-200'
                          } to-transparent mb-6`}></div>
                          <p className="text-base text-gray-600 mt-2">
                            {item.description}
                          </p>
                          <div className={`absolute top-0 right-0 w-24 h-24 ${
                            item.color === 'emerald' ? 'bg-emerald-100' :
                            item.color === 'red' ? 'bg-red-100' :
                            'bg-yellow-100'
                          } opacity-20 rounded-bl-full -z-10`}></div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-12 text-center"
              >
                <Link
                  href="/prizes"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 via-red-500 to-yellow-500 hover:from-emerald-500 hover:via-red-400 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-400/20"
                >
                  Voir tous les lots
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Comment ça marche */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-900/20 via-red-900/95 to-red-800/95 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-emerald-500/20 mt-12"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="lg:text-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-base text-yellow-400 font-semibold tracking-wide uppercase flex items-center justify-center"
                >
                  <QuestionMarkCircleIcon className="h-6 w-6 mr-2" />
                  Instructions
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl"
                >
                  <span className="text-emerald-400">Comment</span> ça marche ?
                </motion.p>
              </div>

              <div className="mt-12">
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                  {[
                    {
                      icon: UserGroupIcon,
                      title: "Inscrivez-vous",
                      description: "Créez votre compte en quelques clics et obtenez vos premiers points gratuits.",
                      color: "emerald",
                      href: "/register"
                    },
                    {
                      icon: CurrencyEuroIcon,
                      title: "Achetez des tickets",
                      description: "Convertissez vos points en tickets de tombola pour participer aux tirages.",
                      color: "red",
                      href: "/play/buy"
                    },
                    {
                      icon: TrophyIcon,
                      title: "Gagnez des lots",
                      description: "Participez aux tirages et gagnez des lots exceptionnels !",
                      color: "yellow",
                      href: "/play"
                    }
                  ].map((item, index) => (
                    <Link href={item.href} key={item.title} className="block h-full">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className={`relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border h-full flex flex-col ${
                          item.color === 'emerald' ? 'border-emerald-100 hover:border-emerald-300' :
                          item.color === 'red' ? 'border-red-100 hover:border-red-300' :
                          'border-yellow-100 hover:border-yellow-300'
                        } transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                      >
                        <div className="flex items-center mb-6">
                          <div className="flex-shrink-0">
                            <div className={`flex items-center justify-center h-14 w-14 rounded-xl ${
                              item.color === 'emerald' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' :
                              item.color === 'red' ? 'bg-gradient-to-r from-red-600 to-red-500' :
                              'bg-gradient-to-r from-yellow-500 to-yellow-400'
                            } text-white`}>
                              <item.icon className="h-8 w-8" />
                            </div>
                          </div>
                          <h3 className={`ml-4 text-xl font-bold ${
                            item.color === 'emerald' ? 'text-emerald-900' :
                            item.color === 'red' ? 'text-red-900' :
                            'text-yellow-900'
                          }`}>
                            {item.title}
                          </h3>
                        </div>
                        <div className={`h-px bg-gradient-to-r ${
                          item.color === 'emerald' ? 'from-emerald-200' :
                          item.color === 'red' ? 'from-red-200' :
                          'from-yellow-200'
                        } to-transparent mb-6`}></div>
                        <p className="text-base text-gray-600 mt-2 flex-grow">
                          {item.description}
                        </p>
                        <div className={`absolute top-0 right-0 w-24 h-24 ${
                          item.color === 'emerald' ? 'bg-emerald-100' :
                          item.color === 'red' ? 'bg-red-100' :
                          'bg-yellow-100'
                        } opacity-20 rounded-bl-full -z-10`}></div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl text-white"
          >
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Prêt à tenter votre chance ?</span>
                <span className="block text-yellow-400">Commencez à jouer dès maintenant.</span>
              </h2>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex rounded-md shadow"
                >
                  <PlaySuperLotButton />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Section Blog */}
          <div className="relative py-24">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 via-red-800/95 to-red-900/95 rounded-xl" />
            <div className="max-w-7xl mx-auto px-4 relative">
              {/* En-tête de section */}
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-4">Actualités Bingoo</h2>
                  <p className="text-lg text-gray-300">Restez informé des derniers gagnants et des nouveaux lots</p>
                </motion.div>
              </div>

              {/* Grille de contenu */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Article principal */}
                <div className="lg:col-span-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-2xl overflow-hidden group"
                  >
                    <div className="aspect-[16/9] relative">
                      <Image
                        src="/images/winner1.png"
                        alt="Grand gagnant du mois"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-400/90 text-red-900 mb-4">
                          🏆 Gagnant du Mois
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-8">
                        <h3 className="text-3xl font-bold text-white mb-4">
                          Marie remporte le scooter électrique !
                        </h3>
                        <p className="text-lg text-gray-200 mb-6 max-w-2xl">
                          Découvrez comment Marie a réussi à gagner le gros lot avec seulement quelques points...
                        </p>
                        <Link
                          href="/winners/marie-story"
                          className="inline-flex items-center px-6 py-3 rounded-lg bg-yellow-400 text-red-900 hover:bg-yellow-300 transition-colors"
                        >
                          Lire son histoire
                          <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>

                  {/* Articles secondaires */}
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="group h-full"
                    >
                      <div className="relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 h-full flex flex-col">
                        <div className="aspect-video relative">
                          <Image
                            src="/images/prizes/current/motorcycle.png"
                            alt="Nouveau lot"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-sm bg-yellow-400/90 text-red-900 font-medium">
                              Nouveau Lot
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                            <span>Bingoo Team</span>
                            <span>•</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                            Un nouveau scooter à gagner
                          </h4>
                          <p className="text-base text-gray-600 mb-4 flex-grow">
                            Découvrez notre dernier modèle de scooter électrique. Une opportunité unique de gagner ce véhicule écologique et tendance.
                          </p>
                          <Link
                            href="/lots/scooter"
                            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mt-auto font-medium"
                          >
                            Voir le lot →
                          </Link>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="group h-full"
                    >
                      <div className="relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 h-full flex flex-col">
                        <div className="aspect-video relative">
                          <Image
                            src="/images/winner2.jpg"
                            alt="Guide des points"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-sm bg-yellow-400/90 text-red-900 font-medium">
                              Guide
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                            <span>Bingoo Team</span>
                            <span>•</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                            Comment gagner plus de points ?
                          </h4>
                          <p className="text-base text-gray-600 mb-4 flex-grow">
                            Découvrez nos astuces et stratégies pour maximiser vos chances de gagner. Des conseils d'experts pour ...
                          </p>
                          <Link
                            href="/guides/points"
                            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mt-auto font-medium"
                          >
                            Lire le guide →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Prochains tirages */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-xl bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 backdrop-blur-sm border border-yellow-400/20 p-6"
                  >
                    <h4 className="text-lg font-semibold text-white mb-6">Prochains tirages</h4>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Scooter Électrique</p>
                          <p className="text-sm text-yellow-400">Dans 2 jours</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">iPhone 15</p>
                          <p className="text-sm text-emerald-400">Dans 5 jours</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Articles rapides */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-4"
                  >
                    <div className="group p-4 rounded-xl bg-gradient-to-br from-emerald-400/10 to-emerald-400/5 backdrop-blur-sm border border-emerald-400/20 hover:border-emerald-400/40 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-emerald-500/20">
                            <Image
                              src="/images/winner3.jpg"
                              alt="Témoignage"
                              width={100}
                              height={100}
                              className="object-cover rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <span className="text-emerald-400 text-sm">Témoignage</span>
                          <h4 className="text-white font-medium">Les conseils de nos gagnants</h4>
                        </div>
                      </div>
                    </div>

                    <div className="group p-4 rounded-xl bg-gradient-to-br from-red-400/10 to-red-400/5 backdrop-blur-sm border border-red-400/20 hover:border-red-400/40 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-red-500/20">
                            <Image
                              src="/images/event.jpg"
                              alt="Événement"
                              width={100}
                              height={100}
                              className="object-cover rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <span className="text-red-400 text-sm">Événement</span>
                          <h4 className="text-white font-medium">Tirage spécial ce weekend</h4>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Carte publicitaire vidéo */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8"
                  >
                    <div className="group rounded-xl bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/40 transition-colors overflow-hidden">
                      <div className="relative h-[280px]">
                        <video
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                          poster="/images/pub-poster.jpg"
                        >
                          <source src="/videos/pub-bingoo.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/50 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 text-xs bg-yellow-400/90 text-black font-medium rounded-sm">
                            Publicité
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                          Découvrez nos nouveaux lots
                        </h4>
                        <p className="text-sm text-gray-400 mt-1 mb-4">
                          Des lots exceptionnels vous attendent chaque semaine
                        </p>
                        <div className="flex items-center gap-3">
                          <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <path d="M12 8V16M8 12H16M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Participer
                          </button>
                          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <path d="M11 5L6 9H2V15H6L11 19V5ZM19.07 4.93C17.22 3.08 14.66 2 12 2V4C14.09 4 16.09 4.85 17.66 6.42C19.23 8 20.08 10 20.08 12C20.08 14 19.23 16 17.66 17.58C16.09 19.15 14.09 20 12 20V22C14.66 22 17.22 20.92 19.07 19.07C20.92 17.22 22 14.66 22 12C22 9.34 20.92 6.78 19.07 4.93Z" fill="currentColor"/>
                            </svg>
                            En savoir plus
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bouton Voir plus */}
              <div className="text-center mt-16">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-400/20"
                >
                  Voir toutes les actualités
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
