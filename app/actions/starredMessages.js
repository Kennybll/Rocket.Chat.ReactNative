import * as types from './actionsTypes';

export function openStarredMessages(rid) {
	return {
		type: types.STARRED_MESSAGES.OPEN,
		rid
	};
}

export function closeStarredMessages() {
	return {
		type: types.STARRED_MESSAGES.CLOSE
	};
}

export function starredMessageReceived(message) {
	return {
		type: types.STARRED_MESSAGES.MESSAGE_RECEIVED,
		message
	};
}

export function starredMessageUnstarred(messageId) {
	return {
		type: types.STARRED_MESSAGES.MESSAGE_UNSTARRED,
		messageId
	};
}
