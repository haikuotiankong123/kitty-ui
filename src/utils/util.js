
let util = {}

util.message = msg => {
    window.vm.$message(msg)
}

util.error = msg => {
    window.vm.$message.error(msg)
}

util.warning = msg => {
    window.vm.$message.warning(msg)
} 


export default util