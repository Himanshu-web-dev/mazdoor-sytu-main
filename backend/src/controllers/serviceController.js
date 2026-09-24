// src/controllers/serviceController.js
const { TRADE_CATEGORIES, FINANCIAL_RULES } = require('../utils/constants')
const { sendSuccess } = require('../utils/response')

const SERVICES_CATALOG = [
  {
    id: 'srv-elec',
    name: 'Electrician',
    title: 'Electrician',
    icon: '⚡',
    baseRate: '₹250',
    defaultRatePaise: 25000,
    minLabourRatePaise: 19900,
    maxLabourRatePaise: 150000,
    advanceFee: FINANCIAL_RULES.BOOKING_ADVANCE_FEE,
    advanceFeePaise: FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE,
    desc: 'Wiring, switches, fans, fuse & MCB repair'
  },
  {
    id: 'srv-plumb',
    name: 'Plumber',
    title: 'Plumber',
    icon: '🔧',
    baseRate: '₹250',
    defaultRatePaise: 25000,
    minLabourRatePaise: 19900,
    maxLabourRatePaise: 200000,
    advanceFee: FINANCIAL_RULES.BOOKING_ADVANCE_FEE,
    advanceFeePaise: FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE,
    desc: 'Pipe leakage, tap fittings, sanitary & water tank'
  },
  {
    id: 'srv-carp',
    name: 'Carpenter',
    title: 'Carpenter',
    icon: '🪚',
    baseRate: '₹300',
    defaultRatePaise: 30000,
    minLabourRatePaise: 24900,
    maxLabourRatePaise: 250000,
    advanceFee: FINANCIAL_RULES.BOOKING_ADVANCE_FEE,
    advanceFeePaise: FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE,
    desc: 'Door locks, furniture repair, hinges & cabinetry'
  },
  {
    id: 'srv-paint',
    name: 'Painter',
    title: 'Painter',
    icon: '🎨',
    baseRate: '₹350',
    defaultRatePaise: 35000,
    minLabourRatePaise: 29900,
    maxLabourRatePaise: 300000,
    advanceFee: FINANCIAL_RULES.BOOKING_ADVANCE_FEE,
    advanceFeePaise: FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE,
    desc: 'Wall putty, primer touch-up, exterior & interior finish'
  },
  {
    id: 'srv-mason',
    name: 'Mason',
    title: 'Mason',
    icon: '🧱',
    baseRate: '₹400',
    defaultRatePaise: 40000,
    minLabourRatePaise: 34900,
    maxLabourRatePaise: 350000,
    advanceFee: FINANCIAL_RULES.BOOKING_ADVANCE_FEE,
    advanceFeePaise: FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE,
    desc: 'Brickwork, plastering, tile repair & concrete'
  },
  {
    id: 'srv-appliance',
    name: 'Appliance Tech',
    title: 'Appliance Tech',
    icon: '❄️',
    baseRate: '₹350',
    defaultRatePaise: 35000,
    minLabourRatePaise: 29900,
    maxLabourRatePaise: 250000,
    advanceFee: FINANCIAL_RULES.BOOKING_ADVANCE_FEE,
    advanceFeePaise: FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE,
    desc: 'AC service, washing machine, refrigerator repair'
  },
  {
    id: 'srv-weld',
    name: 'Welder',
    title: 'Welder',
    icon: '⚙️',
    baseRate: '₹350',
    defaultRatePaise: 35000,
    minLabourRatePaise: 29900,
    maxLabourRatePaise: 200000,
    advanceFee: FINANCIAL_RULES.BOOKING_ADVANCE_FEE,
    advanceFeePaise: FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE,
    desc: 'Iron gates, grills, window frames & fabrication'
  },
  {
    id: 'srv-helper',
    name: 'Helper / Labour',
    title: 'Helper / Labour',
    icon: '👷',
    baseRate: '₹200',
    defaultRatePaise: 20000,
    minLabourRatePaise: 15000,
    maxLabourRatePaise: 100000,
    advanceFee: FINANCIAL_RULES.BOOKING_ADVANCE_FEE,
    advanceFeePaise: FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE,
    desc: 'Loading, site clearing, digging & construction assist'
  }
]

const serviceController = {
  /**
   * Get all active services with standard rate cards and ₹99 advance fee
   */
  async getAllServices(req, res, next) {
    return sendSuccess(res, SERVICES_CATALOG)
  },

  /**
   * Get trade categories list
   */
  async getCategories(req, res, next) {
    return sendSuccess(res, TRADE_CATEGORIES)
  }
}

module.exports = serviceController
