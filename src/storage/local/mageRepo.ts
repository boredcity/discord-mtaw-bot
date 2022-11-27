import { Mage, getEmptyMageTemplate, BasicMageInfo } from '../../entities/Mage'
import { LocalFileRepo } from './localFileRepo'

export const mageStore = new LocalFileRepo(
    `mages`,
    `0.0.1`,
    Mage,
    (basicInfo: BasicMageInfo) => getEmptyMageTemplate(basicInfo),
)
