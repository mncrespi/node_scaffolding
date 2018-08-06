import _                    from 'lodash'
import config               from '../../config/env'
import httpStatus           from 'http-status'
import logger               from '../../config/winston'


/**
 * Error Response Template based on API Standard
 * @param status - Status Code of Request
 * @param userMsg - User Message
 * @param devMsg - Developer Message, Stack Trace
 * @param errorCode - Status Error Code
 * @param moreInfo - Help
 * @returns {*}
 */
function error(status = 500, userMsg = '', devMsg = '', errorCode = 0, moreInfo = '') {
  try {
    if (config.env === 'production') {
      if (Array.isArray(devMsg)) {
        const _devMsg = devMsg
        devMsg = ''
        _devMsg.map((err) => {
          devMsg += err.messages + ', '
        })
      }
    }

    return {
      status: status,
      userMessage: (userMsg) ? userMsg : httpStatus[status],
      developerMessage: devMsg,
      errorCode: (errorCode) ? errorCode : status,
      moreInfo: moreInfo,
    }
  } catch (e) {
    logger.error('APIStandarResponses::Error', e)
    return {
      status: 500,
      userMessage: httpStatus[500],
      developerMessage: '',
      errorCode: 500,
      moreInfo: '',
    }
  }
}

/**
 * List Response Template based on API Standard
 * @param {number} offset - Number of users to be skipped.
 * @param {number} limit - Limit number of users to be returned.
 * @param {array} list - List of Elements.
 * @param {object} metadata - Optional Metadata
 * @returns {*}
 */
function list(offset, limit, list, metadata = null) {
  try {
    const resObj = {
      metadata: {
        resultset: {
          count: list.length,
          offset: parseInt(offset),
          limit: parseInt(limit),
        },
      },
      results: list,
    }

    /** Merge Optional Metadata on resObj */
    if (_.isPlainObject(metadata)) {
      Object.assign(resObj.metadata, metadata)
    }

    return resObj
  } catch (e) {
    logger.error('APIStandarResponses::List', e)
    return error(500)
  }
}

export default {
  list,
  error,
}