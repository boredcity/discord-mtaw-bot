import { ArcanaDescription, RoteDescription } from '../../../wodTypes/common'
import { capitalize } from '../../common/capitalize'

export const getArcanaRequirementsString = ({
    arcana,
    level,
}: ArcanaDescription) => `${capitalize(arcana)} ${`●`.repeat(level)}`

export const getFullArcanaRequirementsString = (
    base: ArcanaDescription | RoteDescription,
    secondary?: ArcanaDescription,
) => {
    const baseString = getArcanaRequirementsString(base)
    if (`secondaryRequiredArcana` in base) {
        secondary ??= base.secondaryRequiredArcana
    }
    const secondaryString = secondary
        ? `+${getArcanaRequirementsString(secondary)}`
        : ``
    return `${baseString}${secondaryString}`
}
