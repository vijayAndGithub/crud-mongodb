const checkPermission = async (permission, userData) => {
    console.log(userData)
    if (userData.account_type === 'admin') return true
    if (userData[ permission ]) return true
    return false
}

module.exports = {
    checkPermission
}