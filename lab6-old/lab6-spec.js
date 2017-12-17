'use strict'

const chai = require('chai')
const sinon = require('sinon')
const Lab6 = require('./lab6')

const expect = chai.expect

// for step5
const fs = require('fs')

// for step8
const cassandraDriver = require('cassandra-driver')
const CASSANDRA_CONTACT_POINTS = [process.env.CASSANDRA_HOST || '127.0.0.1']
const CASSANDRA_KEY_SPACE = 'my_db'

// for step1 - 4
// let lab6 = Lab6()

// for step5
let lab6 = null

describe('Lab6: Stub Database', function () {
  this.timeout(5000)

  // for step5
  beforeEach(() => {
    lab6 = new Lab6()
  })

  // for step1
  it('Expect exec method will return correct struct', function () {
    // arrange
    const NUMBER_OF_PEOPLE = 'numberOfPeople'
    const TOTAL_OF_AGE = 'totalOfAge'
    const AVG_AGE_OF_PEOPLE = 'avgAgeOfPeople'

    // act
    lab6
      .setFS(fs)
      .exec()
      .then((RESULT) => {
        // assert
        expect(RESULT).to.have.property(NUMBER_OF_PEOPLE)
        expect(RESULT).to.have.property(TOTAL_OF_AGE)
        expect(RESULT).to.have.property(AVG_AGE_OF_PEOPLE)
      })
      .catch((error) => {
        throw new Error(error)
      })
  })

  // for test2
  it('Expect getDataFromFile method will return correct data', function (done) {
    const EXPECT_RESULT = [ { Id: '46568326-f158-4aa1-b1f5-d65840736cd3', Name: 'Levi', Age: 19 },
      { Id: '5139ba57-fa99-4df4-91fe-7ead588ff27a', Name: 'Marry', Age: 44 },
      { Id: '0efd11fd-6bc4-4f5f-b5ed-8baa23cad047', Name: 'Mike', Age: 27 },
      { Id: '44a3d909-0822-4af9-bfaa-f9589cc3be39', Name: 'Peter', Age: 30 } ]

    lab6
      // for step5
      .setFS(fs)
      .getDataFromFile()
      .then((persons) => {
        expect(persons).to.deep.equal(EXPECT_RESULT)
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('Expect exec method will return correct data', function (done) {
    const EXPECT_RESULT = {
      numberOfPeople: 4,
      totalOfAge: 120,
      avgAgeOfPeople: 30
    }

    lab6
      // for step6
      .setFS(fs)
      .exec()
      .then((persons) => {
        expect(persons).to.deep.equal(EXPECT_RESULT)
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  // for step7
  // it('Expect getDataFromDataBase method will return correct data', function (done) {
  //   const EXPECT_RESULT = [ { Id: '46568326-f158-4aa1-b1f5-d65840736cd3', Name: 'Levi', Age: 19 },
  //     { Id: '5139ba57-fa99-4df4-91fe-7ead588ff27a', Name: 'Marry', Age: 44 },
  //     { Id: '0efd11fd-6bc4-4f5f-b5ed-8baa23cad047', Name: 'Mike', Age: 27 },
  //     { Id: '44a3d909-0822-4af9-bfaa-f9589cc3be39', Name: 'Peter', Age: 30 } ]

  //   lab6
  //     .getDataFromDataBase()
  //     .then((persons) => {
  //       expect(persons).to.deep.equal(EXPECT_RESULT)
  //       done()
  //     })
  //     .catch((error) => {
  //       done(error)
  //     })
  // })

  // fot step8
  it('Expect getDataFromDataBase method will return correct data', function (done) {
    const cassandraClient = new cassandraDriver.Client({ contactPoints: CASSANDRA_CONTACT_POINTS, keyspace: CASSANDRA_KEY_SPACE })

    const EXPECT_RESULT = [ { Id: '46568326-f158-4aa1-b1f5-d65840736cd3', Name: 'Levi', Age: 19 },
      { Id: '5139ba57-fa99-4df4-91fe-7ead588ff27a', Name: 'Marry', Age: 44 },
      { Id: '0efd11fd-6bc4-4f5f-b5ed-8baa23cad047', Name: 'Mike', Age: 27 },
      { Id: '44a3d909-0822-4af9-bfaa-f9589cc3be39', Name: 'Peter', Age: 30 } ]

    lab6
      .setCassandraClient(cassandraClient)
      .getDataFromDataBase()
      .then((persons) => {
        expect(persons).to.deep.equal(EXPECT_RESULT)
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  // for step9
  it('Expect database crash will return `DatabaseError`', function (done) {
    const cassandraClient = new cassandraDriver.Client({ contactPoints: CASSANDRA_CONTACT_POINTS, keyspace: CASSANDRA_KEY_SPACE })

    const fakeError = new Error('DatabaseError')
    sinon.stub(cassandraClient, 'execute').throws(fakeError)

    lab6
      .setCassandraClient(cassandraClient)
      .getDataFromDataBase()
      .then((THIS_IS_ERROR) => {
        done(THIS_IS_ERROR)
      })
      .catch((error) => {
        expect(error.message).to.be.equal('DatabaseError')
        done()
      })
  })
})