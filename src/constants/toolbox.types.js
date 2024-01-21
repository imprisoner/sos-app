export const actions = [
  { id: 1, text: 'Count down from 100 to 0 in increments of 7 each time.', color: 'purple', highlight: null, value: 'a.1' },
  { id: 2, text: 'Place bare feet on the floor', color: 'purple', highlight: null, value: 'a.2' },
  {
    id: 3,
    text: 'Breathe with me: deep breath for a count of 4, another deep breath for a count of 2, long exhale. And another one, and another one.',
    color: 'purple', highlight: null, value: 'a.3'
  },
  { id: 4, text: 'Can you take a glass of cold water or ask someone to bring it to you?', color: 'purple', highlight: null, value: 'a.4' },
  { id: 5, text: 'Can you hold an ice cube, or ask someone to bring it to you?', color: 'purple', highlight: null, value: 'a.5' },
  { id: 6, text: 'Lie on the bed and close your eyes, Im here with you', color: 'purple', highlight: null, value: 'a.6' },
  { id: 7, text: 'Self Hug: Hug your shoulders with your hands for a few seconds.', color: 'purple', highlight: null, value: 'a.7' },
  { id: 8, text: 'Place your hands on your thighs and gently tap them alternately: right, left, right, left.', color: 'purple', highlight: null, value: 'a.8' },
  { id: 9, text: 'Touch 3 objects around you', color: 'purple', highlight: null, value: 'a.9' },
  { id: 10, text: 'Describe the place you are in right now.', color: 'purple', highlight: null, value: 'a.10' },
]
export const questions = [
  {id: 1, text: 'Where do you feel the pain in your body?', color: 'blueDeep', highlight: null, value: 'q.1'},
  {
    id: 2,
    text: 'What does this pain feel like? is it burning? Is it stabbing? is it presses?',
    color: 'blueDeep', highlight: null, value: 'q.2'
  },
  {id: 3, text: 'How much does it hurt you?', color: 'blueDeep', highlight: null, value: 'q.3'},
  {id: 4, text: 'How many red colored objects are there around you?', color: 'blueDeep', highlight: null, value: 'q.4'},
  {id: 5, text: 'What objects do you see around you now?', color: 'blueDeep', highlight: null, value: 'q.5'},
  {id: 6, text: 'How many letters are in your full name?', color: 'blueDeep', highlight: null, value: 'q.6'},
  {id: 7, text: 'What day is today?', color: 'blueDeep', highlight: null, value: 'q.7'},
  {id: 8, text: 'What voices do you hear around you?', color: 'blueDeep', highlight: null, value: 'q.8'},
]
export const sentences = [
  {id: 1, text: 'You are not alone, I am with you', color: 'greenMedium', highlight: null, value: 's.1'},
  {id: 2, text: 'I see that you are in pain, it will soon be over', color: 'greenMedium', highlight: null, value: 's.2'},
  {id: 3, text: 'I see this wave is hard, I\'m here with you', color: 'greenMedium', highlight: null, value: 's.3'},
  {id: 4, text: 'You are doing great', color: 'greenMedium', highlight: null, value: 's.4'},
  {id: 5, text: 'I see that the wave has calmed down a bit', color: 'greenMedium', highlight: null, value: 's.5'},
  {id: 6, text: 'You are a hero and strong and you will get through this', color: 'greenMedium', highlight: null, value: 's.6'},
  {id: 7, text: 'This is almost the end of the wave, it will soon be over', color: 'greenMedium', highlight: null, value: 's.7'},
  {id: 8, text: 'Your body is relaxing itself', color: 'greenMedium', highlight: null, value: 's.8'},
]

export const ACTIONS = {
  letter: 'a',
  lastItemId: 10,
  image: 'action',
  color: 'purple',
  data: actions
}

export const SENTENCES = {
  letter: 's',
  lastItemId: 8,
  image: 'sentence',
  color: 'blueDeep',
  data: sentences
}

export const QUESTIONS = {
  letter: 'q',
  lastItemId: 8,
  image: 'question',
  color: 'greenMedium',
  data: questions
}

// для фронта

export const TOOLBOX = [
  {
      id: 1,
      name: 'Actions',
      image: 'action',
      color: 'purple',
      data: ACTIONS.data
  },
  {
      id: 2,
      name: 'Questions',
      image: 'question',
      color: 'blueDeep',
      data: QUESTIONS.data
  },
  {
      id: 3,
      name: 'Sentences',
      image: 'sentence',
      color: 'greenMedium',
      data: SENTENCES.data
  },
]