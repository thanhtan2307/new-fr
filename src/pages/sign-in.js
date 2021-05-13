import { Link, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { usernameValidate } from '../utils/validate'
import api from '../utils/axios'

import { connect } from 'react-redux'
import { getUserInfo } from '../redux/actions/webActions'

const SignUpSelector = (props) => {

    const [usernameErr, logUsernameErr] = useState(false)
    const [userData, setUserData] = useState({})
    const [passCheck, setPassCheck] = useState(false)
    const [login, setLogin] = useState(false)

    const history = useHistory()

    useEffect(() => {
        localStorage.clear()
    }, [])

    const usernameValidation = (e) => {
        let value = e.target.value
        value = value.trim()
        setUserData({
            ...userData,
            username: value
        })

        if (value !== '') {
            logUsernameErr(!usernameValidate(value))
            if (checkValidate(!usernameValidate(value), passCheck) && value?.length > 0 && userData.password?.length >= 6) {
                setLogin(true)
            } else {
                setLogin(false)
            }
        } else {
            logUsernameErr(false)
        }
    }

    const passValidation = (e) => {
        let value = e.target.value
        value = value.trim()

        setUserData({
            ...userData,
            password: value
        })

        if (value.length < 5) {
            setPassCheck(true)
        } else {
            setPassCheck(false)
        }

        if (checkValidate(usernameErr, passCheck) && userData.username?.length > 0 && value?.length >= 6) {
            setLogin(true)
        } else {
            setLogin(false)
        }
    }


    const checkValidate = (usernameErr, passCheck) => {
        if (!usernameErr && !passCheck) {
            return true
        } else return false
    }

    const submitHandle = (e) => {
        if (checkValidate(usernameErr, passCheck)) {
            api('POST', '/api/sign-in', userData)
                .then(res => {
                    const { data } = res
                    const { userToken } = data
                    const role = data.userData && data.userData.role || 'user'

                    if (data.logged) {
                        const userInfo = data.userData
                        
                        localStorage.setItem('logged', true)
                        localStorage.setItem('firstName', userInfo.firstName)
                        localStorage.setItem('lastName', userInfo.lastName)
                        localStorage.setItem('userId', userInfo.id)
                        localStorage.setItem('userImage', userInfo.image)
                        localStorage.setItem('userBio', userInfo.bio)
                        localStorage.setItem('userToken', userToken)
                        localStorage.setItem('role', role)

                        props.getUserInfo()

                        history.replace({ pathname: '/' })
                    } else {
                        alert('Thông tin tài khoản không đúng, vui lòng đăng nhập lại.')
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        } else {
            alert('Thông tin không hợp lệ!')
        }
        e.preventDefault()
    }

    return (
        <>
            <div className='sign-in-container'>
                <div className='sign-in-header'>
                    <div className='sign-in-logo-wrapper'>
                        <Link to='/'>
                            <img src='/images/pageLogo.png' />
                        </Link>
                    </div>
                    <h1 className='sign-in-title'>Welcome!</h1>
                </div>
                <form onSubmit={(e) => submitHandle(e)} id='sign-up-form'>
                    <label htmlFor='username'>Username: </label>
                    <input onChange={(e) => usernameValidation(e)} className={usernameErr ? 'validate-error' : ''} required id='username' placeholder='Enter your Username' name='username' />
                    <label htmlFor='password'>Password: </label>
                    <input onChange={(e) => passValidation(e)} required type='password' placeholder='******' id='password' name='password' />
                    <Link className='link-to-sign-in' to='/forget'>
                        Forgot password?
                    </Link>
                    <div className='form-btn'>
                        <button disabled={!login} type='submit' className={login ? 'sign-btn active' : 'sign-btn'}>
                            Sign in
                        </button>
                    </div>
                    <div className='form-auths'>
                        
                    </div>
                </form>
                <Link to='/sign-up' className='link-to-sign-in'>
                    You don't have an account? Sign-up here!
                </Link>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        web: state.web
    }
}

const mapActionsToProps = {
    getUserInfo
}

const SignUp = connect(mapStateToProps, mapActionsToProps)(SignUpSelector)

export default SignUp
