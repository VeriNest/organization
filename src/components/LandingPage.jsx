import { motion } from "framer-motion";
import VerinestLogo from "/assets/verinestlogo.svg";
import CustomButton from "./CustomButton";
import { CustomCard, CustomCardContent } from "./CustomCard";
import house1 from "/assets/house1.svg";
import house2 from "/assets/house2.svg";
import house3 from "/assets/house3.svg";
import quote from "/assets/quote.svg";
import telegram from "/assets/telegram.svg";
import github from "/assets/github.svg";
import discord from "/assets/discord.svg";
import twitter from "/assets/twitter.svg";
import { useNavigate } from "react-router-dom";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto"
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={VerinestLogo}
          alt="verinestlogo.svg"
        />
        <CustomButton
          variant="primary"
          className="md:flex hidden"
          onClick={() => navigate("/login")}
        >
          Get Started
        </CustomButton>
      </motion.header>

      {/* Hero Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-6"
          >
            <motion.h1
              variants={fadeIn}
              className="text-5xl font-bold text-slate-900 leading-tight"
            >
              Africa's Real Estate.
              <br />
              Verified by Code
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-lg text-slate-600 max-w-md"
            >
              A blockchain-powered platform for buying, selling and verifying
              property in Nigeria and beyond.
            </motion.p>
            <motion.div variants={fadeIn}>
              <CustomButton
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/login")}
              >
                Get Started
              </CustomButton>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex gap-4 md:gap-6"
          >
            <motion.img
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={house1}
              alt="house1.svg"
              className="h-auto"
            />
            <div className="flex-col w-full">
              <motion.img
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={house2}
                alt="house2.svg"
                className="bottom-0 right-[50px] h-auto"
              />
              <motion.img
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                src={house3}
                alt="house3.svg"
                className="h-auto mt-8"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How VeriNest Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-slate-800 px-6 py-16"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={fadeIn}
            className="text-3xl font-bold text-white mb-12"
          >
            How VeriNest Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Buyer Flow",
                items: [
                  "1. Browse verified properties",
                  "2. Pay with Naira or VERN",
                  "3. Get legally validated ownership",
                ],
              },
              {
                title: "Landlord Flow",
                items: [
                  "1. Upload property",
                  "2. Verified by agent + lawyer",
                  "3. Get paid after escrow clears",
                ],
              },
              {
                title: "Worker Flow",
                items: [
                  "1. Apply for verified jobs",
                  "2. Get matched by skill & location",
                  "3. Earn VERN instantly",
                ],
              },
            ].map((card, index) => (
              <motion.div key={index} variants={scaleIn}>
                <CustomCard variant="white">
                  <CustomCardContent>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">
                      {card.title}
                    </h3>
                    <ol className="space-y-2 text-slate-600">
                      {card.items.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 0.3 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ol>
                  </CustomCardContent>
                </CustomCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tokenomics */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="px-6 py-16 max-w-7xl mx-auto"
      >
        <motion.h2
          variants={fadeIn}
          className="text-3xl font-bold text-slate-900 mb-12"
        >
          Powered by the VERN token
        </motion.h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Phase 1",
              items: ["MVP Launch", "Wallet connect", "listings, Verification"],
            },
            {
              title: "Phase 2",
              items: [
                "Labor & Escrow",
                "Worker jobs, GPS",
                "smart contract escrow",
              ],
            },
            {
              title: "Phase 3",
              items: [
                "DAO & Moderation",
                "Community voting",
                "staking, governance",
              ],
            },
            {
              title: "Phase 4",
              items: [
                "Scale Across Africa",
                "Legal integrations",
                "more cities",
              ],
            },
          ].map((phase, index) => (
            <motion.div key={index} variants={scaleIn} whileHover={{ y: -5 }}>
              <CustomCard variant="dark">
                <CustomCardContent className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{phase.title}</h3>
                  {phase.items.map((item, i) => (
                    <p key={i} className="text-sm text-slate-300 mb-1">
                      {item}
                    </p>
                  ))}
                </CustomCardContent>
              </CustomCard>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeIn} className="flex gap-4">
          <CustomButton variant="primary">View Full Tokenomics</CustomButton>
          <CustomButton variant="outline">Explore</CustomButton>
        </motion.div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
        className="bg-slate-50 px-6 py-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.blockquote
              variants={fadeIn}
              className="text-2xl text-slate-700 italic flex items-start space-x-1"
            >
              <img src={quote} alt="" />
              <span> I sold my land through VeriNest and it was seamless</span>
            </motion.blockquote>
            <motion.blockquote
              variants={fadeIn}
              className="text-2xl text-slate-700 italic flex items-start space-x-1"
            >
              <img src={quote} alt="" />
              <p> Got paid for my work in crypto. Fast and clean.</p>
            </motion.blockquote>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-slate-100 px-6 py-16"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeIn} className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Join the VeriNest Movement
            </h2>
          </motion.div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <motion.div
              variants={fadeIn}
              className="flex items-center gap-2 mb-6 md:mb-0"
            >
              <img src={VerinestLogo} alt="" />
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap gap-6 text-slate-600"
            >
              {[
                "Features",
                "How it works",
                "Contact Us",
                "Terms of Service",
                "Privacy Policy",
              ].map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -2, color: "#1e293b" }}
                  className="hover:text-slate-800"
                >
                  {link}
                </motion.a>
              ))}
            </motion.div>
          </div>
          <motion.div
            variants={fadeIn}
            className="flex justify-between items-center mt-8 pt-8 border-t border-slate-200"
          >
            <div className="flex gap-4">
              {[
                { icon: twitter, alt: "Twitter", href: "https://twitter.com" },
                { icon: github, alt: "GitHub", href: "#" },
                { icon: telegram, alt: "Telegram", href: "https://t.me" },
                { icon: discord, alt: "Discord", href: "https://discord.com" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={social.icon}
                    alt={social.alt}
                    className="w-6 h-6 hover:opacity-80 transition"
                  />
                </motion.a>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-500 text-sm"
            >
              © copyright 2025
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
