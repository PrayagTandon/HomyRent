"use client";

import React from 'react'
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0, y: 50},
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20},
    visible: { opcaity: 1, y: 0}
};

const FeaturesSection = () => {
  return (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{once: true}}
        variants={containerVariants}
        className=" py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white"
    >
        FeaturesSection
    </motion.div>
  )
}

export default FeaturesSection;