/**
 * WhatsApp deep-link helper — zero-cost, no API keys needed.
 * Opens WhatsApp in browser or app with a pre-filled message.
 * Receptionist just hits Send.
 */

const HOSPITAL_WHATSAPP = import.meta.env.VITE_HOSPITAL_WHATSAPP || '923XXXXXXXXX'
const HOSPITAL_NAME = import.meta.env.VITE_HOSPITAL_NAME || 'Alim Khatoon Medicare'

/**
 * Generate a wa.me deep-link.
 * @param phone — any format, will be normalised to 92XXXXXXXXXX
 * @param message — plain text, will be URL-encoded
 */
export function generateWALink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '')
  // Normalise to international format
  let intl = digits
  if (digits.startsWith('0')) {
    intl = '92' + digits.slice(1)       // 03XX → 923XX
  } else if (!digits.startsWith('92')) {
    intl = '92' + digits
  }
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`
}

// ─── Message Templates ───────────────────────────────────────────────────────

export function waOpdTokenPatient(params: {
  name: string
  tokenNumber: string
  doctor: string
  date: string
  time: string
  phone: string
}): string {
  const message =
    `Assalam-o-Alaikum ${params.name}!\n` +
    `Aap ka OPD Token #${params.tokenNumber} confirm ho gaya.\n` +
    `Doctor: ${params.doctor}\n` +
    `Date: ${params.date}, Time: ${params.time}\n` +
    `${HOSPITAL_NAME}, Green Town Lahore.\n` +
    `Meherbani farma kar 10 minute pehle aa jayein.`
  return generateWALink(params.phone, message)
}

export function waOpdTokenDoctor(params: {
  patientName: string
  tokenNumber: string
  date: string
  time: string
  doctorWhatsapp: string
}): string {
  const message =
    `New patient booked:\n` +
    `Patient: ${params.patientName}\n` +
    `Token: #${params.tokenNumber}\n` +
    `Date: ${params.date}, Time: ${params.time}\n` +
    `— ${HOSPITAL_NAME}`
  return generateWALink(params.doctorWhatsapp, message)
}

export function waErRegistration(params: {
  patientName: string
  tokenNumber: string
  familyPhone: string
}): string {
  const message =
    `Assalam-o-Alaikum!\n` +
    `${params.patientName} ko Emergency mein register kiya gaya hai.\n` +
    `ER Token: #${params.tokenNumber}\n` +
    `${HOSPITAL_NAME}, Green Town Lahore.\n` +
    `Koi madad ke liye call karein: ${import.meta.env.VITE_HOSPITAL_PHONE}`
  return generateWALink(params.familyPhone, message)
}

export function waIpdAdmission(params: {
  patientName: string
  ward: string
  bed: string
  admitDate: string
  phone: string
}): string {
  const message =
    `Assalam-o-Alaikum!\n` +
    `${params.patientName} ko ${HOSPITAL_NAME} mein admit kiya gaya hai.\n` +
    `Ward: ${params.ward}, Bed: ${params.bed}\n` +
    `Date: ${params.admitDate}\n` +
    `Koi malumat ke liye: ${import.meta.env.VITE_HOSPITAL_PHONE}`
  return generateWALink(params.phone, message)
}

export function waIpdDischarge(params: {
  patientName: string
  dischargeDate: string
  phone: string
}): string {
  const message =
    `Assalam-o-Alaikum!\n` +
    `${params.patientName} ka discharge ${params.dischargeDate} ko complete ho gaya hai.\n` +
    `Discharge summary aur bill tayyar hai.\n` +
    `${HOSPITAL_NAME}, Green Town Lahore.\n` +
    `Shukria!`
  return generateWALink(params.phone, message)
}

export function waInvoiceReady(params: {
  patientName: string
  invoiceNumber: string
  total: number
  phone: string
}): string {
  const message =
    `Assalam-o-Alaikum ${params.patientName}!\n` +
    `Aap ka Invoice #${params.invoiceNumber} tayyar hai.\n` +
    `Total: Rs. ${params.total.toLocaleString()}\n` +
    `${HOSPITAL_NAME}, Green Town Lahore.`
  return generateWALink(params.phone, message)
}

export function waBookingConfirmedPatient(params: {
  name: string
  tokenNumber: string
  doctor: string
  date: string
  time: string
  phone: string
}): string {
  const message =
    `Assalam-o-Alaikum ${params.name}!\n` +
    `Aap ki appointment confirm ho gayi.\n` +
    `OPD Token: #${params.tokenNumber}\n` +
    `Doctor: ${params.doctor}\n` +
    `Date: ${params.date}, Time: ${params.time}\n` +
    `${HOSPITAL_NAME}, Green Town Lahore.\n` +
    `Meherbani farma kar 10 minute pehle aa jayein.`
  return generateWALink(params.phone, message)
}

export function waBookingConfirmedDoctor(params: {
  patientName: string
  tokenNumber: string
  date: string
  time: string
  doctorWhatsapp: string
}): string {
  const message =
    `Online booking confirm:\n` +
    `Patient: ${params.patientName}\n` +
    `Token: #${params.tokenNumber}\n` +
    `Date: ${params.date}, Time: ${params.time}\n` +
    `— ${HOSPITAL_NAME}`
  return generateWALink(params.doctorWhatsapp, message)
}

export function waBookingRejectedPatient(params: {
  name: string
  phone: string
  reason?: string
}): string {
  const message =
    `Assalam-o-Alaikum ${params.name}!\n` +
    `Maafi chahte hain, aap ki requested time slot available nahi hai.\n` +
    (params.reason ? `Wajah: ${params.reason}\n` : '') +
    `Kripya doosra time slot ke liye call karein:\n` +
    `${import.meta.env.VITE_HOSPITAL_PHONE}\n` +
    `— ${HOSPITAL_NAME}`
  return generateWALink(params.phone, message)
}

/** Opens the hospital's own WhatsApp — for appointment confirmation flow */
export function waHospitalLink(message: string): string {
  return generateWALink(HOSPITAL_WHATSAPP, message)
}
