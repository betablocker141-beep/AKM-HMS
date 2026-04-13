import type { UsStudyType } from '@/types'

export interface UsTemplate {
  findings: string
  impression: string
  recommendations: string
  history?: string
}

export const US_TEMPLATES: Record<UsStudyType, UsTemplate> = {
  Abdominal: {
    findings: `Liver           : Normal in size and echotexture. No focal mass lesion. No IHBD dilatation. Portal vein normal.\nGall Bladder    : Normal in size and shape. No calculi. No wall thickening. CBD normal.\nPancreas        : Normal in size, shape and echotexture. No focal lesion seen.\nSpleen          : Normal in size, shape and echotexture. No focal lesion. No free fluid.\nKidneys         : Right: ___×___ cm, Left: ___×___ cm. Both kidneys normal in size, shape and echotexture. No stones or hydronephrosis.\nUrinary Bladder : Normal. No stone or mass seen.\nGeneral Abdomen : Aorta and IVC normal. No bowel dilatation. No lymphadenopathy. No free fluid/ascites.`,
    impression: 'Normal Abdominal Ultrasound.',
    recommendations: '',
  },

  'Pelvic TVS': {
    findings: `Uterus:\nAnteverted uterus seen with normal size, shape, and echotexture\nNo focal mass lesion identified\nNo intrauterine gestational sac seen\nEndometrial thickness measures ___ mm\n\nOvaries:\nBoth ovaries are normal in size and appearance\nLargest follicle measuring ___ mm seen in ___ ovary\nMultiple small follicles noted in both ovaries\n\nCul-de-sac:\nNo free fluid detected`,
    impression: 'Normal Pelvic Scan .',
    recommendations: '',
  },

  Abdomen: {
    findings: `Liver : [findings]\nGall Bladder : [findings]\nCommon Bile Duct : [findings]\nPancreas : [findings]\nSpleen : [findings]\nKidneys : Rt. Kidney measuring ___*___cm\n           Lt. Kidney measuring ___*___cm\nboth kidneys are seen normal in size , shape and echotexture . No stone , mass or dilatation of PCS .\nUrinary Bladder : [findings]\nFree Fluid : Nil`,
    impression: 'Normal Abdominal Scan .',
    recommendations: '',
  },

  Pelvis: {
    findings: `Uterus:\nAnteverted uterus is seen normal in size , shape and echotexture .\nNo focal mass is seen .\n\nOvaries :\nBoth ovaries are seen normal\nMultiple small follicles are seen in both ovaries .\nNo free fluid is seen in cul -de - sac`,
    impression: '',
    recommendations: '',
  },

  Obstetric: {
    findings: `Number of Fetuses    : Single\nPresentation         : ___\nPlacenta             : ___\nAmniotic Fluid       : Adequate\nFetal Movements      : Normal\nFetal Heart Activity : ___\n\nFetal Measurements:\nGSD : ___    AC  : ___    CRL : ___\nBPD : ___    FL  : ___\n\nGestational Age              : ___ weeks + ___ days\nFetal Estimated Weight (EFW) : ___ kg`,
    impression: '',
    recommendations: '',
    history: `M/F :\nLMP :\nGPA :\nLCB :`,
  },

  'Doppler OBS': {
    findings: `No of Fetuses :\nPresentation :\nPlacenta :\nAmniotic Fluid :\nFetal Heart Rate :\n\nBiometry :\nBPD :      HC :      AC :      FL :\nEFW :\nGA by scan :\n\nDoppler Study :\nUmbilical Artery — RI :    PI :    S/D :\nMiddle Cerebral Artery — RI :    PI :\nUterine Artery — Rt. RI :    Lt. RI :\nDuctus Venosus : [findings]`,
    impression: '',
    recommendations: '',
  },

  'TVS USG': {
    findings: `Uterus :\nAnteverted uterus is seen in normal size , shape and echotexture .\nNo focal mass is seen .\nEndometrial thickness measuring ___ mm .\n\nCervix : [findings]\n\nRight Ovary : Size ___*___ cm . [findings]\nLeft Ovary  : Size ___*___ cm . [findings]\n\nPouch of Douglas : No free fluid .`,
    impression: 'Normal TVS .',
    recommendations: '',
  },

  'Neck/Thyroid': {
    findings: `Thyroid Gland :\nRight lobe measuring ___*___*___ cm .\nLeft lobe measuring ___*___*___ cm .\nIsthmus : ___ mm .\nEchotexture : [findings]\nNo nodule / cyst / calcification seen .\n\nParathyroid : Not visualised .\nLymph Nodes : [findings]`,
    impression: 'Normal Thyroid Scan .',
    recommendations: '',
  },

  Scrotal: {
    findings: `Right Testis : Size ___*___*___ cm . [findings]\nLeft Testis  : Size ___*___*___ cm . [findings]\nEpididymis : [findings]\nVascularity : Normal flow on Doppler bilaterally .\nHydrocele : Nil .\nVaricocele : Nil .`,
    impression: 'Normal Scrotal Scan .',
    recommendations: '',
  },

  MSK: {
    findings: `Region : [site]\nSoft Tissue : [findings]\nTendons : [findings]\nMuscles : [findings]\nJoint : [findings]\nBony Cortex : [findings]`,
    impression: 'No significant abnormality .',
    recommendations: '',
  },

  Doppler: {
    findings: `Vessels Examined : [site]\nArteries : [findings]\nVeins : [findings]\nFlow : [findings]`,
    impression: 'No significant vascular abnormality .',
    recommendations: '',
  },

  Echocardiography: {
    findings: `Cardiac Chambers : Normal size and function .\nLV Function : EF ___% .\nWall Motion : Normal .\nValves :\n  Mitral valve : [findings]\n  Aortic valve : [findings]\n  Tricuspid valve : [findings]\n  Pulmonary valve : [findings]\nPericardium : No effusion .\nAortic Root : Normal diameter .`,
    impression: 'Normal Echo .',
    recommendations: '',
  },

  Breast: {
    findings: `Breast Parenchyma    : Normal\nFocal Mass           : Not seen\nAxillary Lymph Nodes : Not enlarged`,
    impression: 'Normal Breast scan',
    recommendations: '',
  },

  KUB: {
    findings: `Kidneys :\nRt. Kidney measuring ___*___ cm . [findings]\nLt. Kidney measuring ___*___ cm . [findings]\nBoth kidneys normal echotexture . No hydronephrosis . No calculi .\n\nUreters : Not dilated .\nUrinary Bladder : [findings]\nPost void residual volume : ___ ml .`,
    impression: 'Normal KUB Scan .',
    recommendations: '',
  },

  Renal: {
    findings: `Right Kidney : Size ___*___ cm . [findings]\nLeft Kidney  : Size ___*___ cm . [findings]\n\nRenal Doppler :\nRight RI : ___  Left RI : ___\n\nUrinary Bladder : [findings]`,
    impression: 'Normal Renal Scan .',
    recommendations: '',
  },

  Hepatobiliary: {
    findings: `Liver : Size ___*___ cm . [findings]\nGall Bladder : [findings]\nCommon Bile Duct : ___ mm .\nCommon Hepatic Duct : [findings]\nIntrahepatic Bile Ducts : Not dilated .`,
    impression: 'Normal Hepatobiliary Scan .',
    recommendations: '',
  },

  'Full Abdomen + Pelvis': {
    findings: `Liver : [findings]\nGall Bladder : [findings]\nBile Ducts : Not dilated .\nPancreas : [findings]\nSpleen : [findings]\nKidneys : Rt. ___*___cm  Lt. ___*___cm  — normal echotexture , no stone .\nUrinary Bladder : [findings]\n\nUterus :\nAnteverted uterus seen normal . Endometrium ___ mm .\nOvaries : Both ovaries normal .\n\nFree Fluid : Nil .`,
    impression: 'Normal Abdomen + Pelvis Scan .',
    recommendations: '',
  },
}
