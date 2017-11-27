const fs = require('fs')
const { deepstream } = require('deepstream.io-client-js')
const config = require('./config')

const state = {}

const raw = fs.readFileSync('./words.txt').toString()
const words = raw.split('\n')
state.words = words

async function initialise () {
  state.client = deepstream(config.url)
  await state.client.login({ username: 'admin' })
  state.record = client.record.getRecord('state')
  await state.record.whenReady()

  state.userList = state.client.record.getList('users')
  await state.userList.whenReady()
  const users = await client.presence.getAll()
  await state.userList.setEntriesWithAck(users)

  await state.record.setWithAck('gamemaster', users[randomIntFromInterval(0, users.length)])
  client.presence.subscribe(handleUserPresence)

  start()
}

async function handleUserPresence (username, loggedIn) {
  if (loggedIn) {
    await state.userList.addEntryWithAck(username)
  } else {
    await state.userList.removeEntryWithAck(username)
  }
}

async function handleGuess (data, response) {
  console.log('guess', data)
  if (words.indexOf(data.word) !== -1) {
    state.record.set('gamemaster', data.username)
    response.send(null)
  } else {
    response.error(null)
  }
}

async function start () {
  client.rpc.provide('guess', handleGuess)
}

function randomIntFromInterval (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

initialise()