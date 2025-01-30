'use client'

import { motion } from "framer-motion"
import { Button as BaseButton } from "./button"

const MotionButton = motion.create(BaseButton)

export { MotionButton as Button } 