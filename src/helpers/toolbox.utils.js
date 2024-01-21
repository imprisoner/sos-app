// строка вида '<type><delimiter><id>', пример: 's.1', 'a.10'
import { ACTIONS, SENTENCES, QUESTIONS } from '#constants/toolbox.types.js'

const delimiter = '.'
const toolbox = {
  [ACTIONS.letter]: ACTIONS,
  [QUESTIONS.letter]: QUESTIONS,
  [SENTENCES.letter]: SENTENCES
}

export const parseTool = (str = "") => {
  const [type, id] = str.split(delimiter)
  const tool = toolbox[type].data.find((item) => item.id === parseInt(id))

  return { 
    ...tool, 
    color: toolbox[type].color, 
    image: toolbox[type].image 
  }
}

export const isValidToolString = (str = "") => {
  const [type, idString] = str.split(delimiter)

  const isValidType = Object.keys(toolbox).includes(type)

  if (!isValidType) {
    return false
  }

  const id = parseInt(idString)

  if (!Boolean(id)) {
    return false
  }

  if (id > toolbox[type].lastItemId) {
    return false
  }

  return true
}