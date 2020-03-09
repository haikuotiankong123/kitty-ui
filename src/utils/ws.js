let ws = function (url, onMessage, onError) {

	let t = {}
	t.running = true
	t.timeOut = undefined

	t.close = function () {
		t.running = false
		t.websocket.close()
	}
	t.open = function () {

		try {

			if ('WebSocket' in window) {
				t.websocket = new WebSocket(url);
			} else {
				onError('WebSocket不支持该浏览器')
			}

			t.websocket.onerror = onError

			t.websocket.onopen = (event) => {
				console.log('websocket opened')
			}
			t.websocket.onmessage = (event) => {
				console.log('websocket onmessage', event)
				onMessage(event.data);
			}
			t.websocket.onclose = () => {
				console.error("websocket.onclose")
				if (t.running) {
					clearTimeout(t.timeOut)
					t.timeOut = setTimeout(() => {
						t.open()
					}, 30000)

				}
			}
			window.onbeforeunload = () => {
				t.close()
			}

		} catch (e) {
			onError(e)
		}

	}

	return t
}

export default ws
