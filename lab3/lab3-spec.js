const chai = require('chai')
const expect = chai.expect

let ReserveString = require('./reserve_string')

let target

describe('Lab3: Reserve String Test Cases', function () {
  beforeEach(() => {
    target = new ReserveString()
  })

  it('Expect get `gfedcba` when input `abcdefg`', function () {
    // Arrange
    const TEST_STRING = 'abcdefg'
    const EXPECT_RESULT = 'gfedcba'

    // Act
    const RESULT = target.exec(TEST_STRING)

    // Assert
    expect(RESULT).to.be.equal(EXPECT_RESULT)
  })

  it('Exepct get `987654321` when input `123456789`', function () {
    // Arrange
    const TEST_STRING = '123456789'
    const EXPECT_RESULT = '987654321'

    // Act
    const RESULT = target.exec(TEST_STRING)

    // Assert
    expect(RESULT).to.be.equal(EXPECT_RESULT)
  })
})
