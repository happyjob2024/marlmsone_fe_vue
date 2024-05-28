<template>
    <div id="background_board">
        <div class="login_form">
            <div class="login-form-right-side">
                <div class="top-logo-wrap">
                    <img
                        id="login-logo"
                        src="@/assets/images/admin/login/logo_img.png"
                    />
                </div>
                <h3>
                    안되는 것이 실패가 아니라 <br />
                    포기하는 것이 실패다
                </h3>
                <p>
                    성공은 실패의 꼬리를 물고 온다. 지금 포기한 것이 있는가?<br />
                    그렇다면 다시 시작해 보자.<br />
                    안되는 것이 실패가 아니라 포기하는 것이 실패다.<br />
                    포기한 순간이 성공하기 5분전이기 쉽다.<br />
                    실패에서 더 많이 배운다.<br />
                    실패를 반복해서 경험하면 실망하기 쉽다. <br />
                    하지만 포기를 생각해선 안된다. <br />
                    실패는 언제나중간역이지 종착역은 아니다.
                </p>
                <p>- 이대희, ‘1%의 가능성을 희망으로 바꾼 사람들’ 에서</p>
            </div>
            <div class="login-form-left-side">
                <fieldset>
                    <legend>로그인</legend>
                    <p class="id">
                        <label for="userId">아이디</label>
                        <input
                            v-model="loginId"
                            type="text"
                            placeholder="아이디"
                            style="ime-mode: inactive"
                            id="userId"
                            ref="userId"
                        />
                    </p>
                    <p class="pw">
                        <label for="userPwd">비밀번호</label>
                        <input
                            v-model="pwd"
                            type="password"
                            placeholder="비밀번호"
                            onfocus="this.placeholder=''; return true"
                            id="userPwd"
                            ref="userPwd"
                        />
                    </p>
                    <p class="member_info">
                        <input
                            v-model="saveId"
                            id="cb_saveId"
                            type="checkbox"
                        />
                        <span class="id_save">ID저장</span>
                    </p>
                    <div>
                        <a href="" id="RegisterBtn" name="modal"
                            ><strong>[회원가입]</strong></a
                        >
                        <a href=""><strong>[아이디/비밀번호 찾기]</strong></a>
                    </div>
                    <a class="btn_login" id="btn_login" @click="fLoginProc">
                        <strong>Login</strong>
                    </a>
                </fieldset>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            loginId: "",
            pwd: "",
            saveId: false,
        };
    },
    mounted() {
        let id = this.getCookie("LOGIN_ID");
        this.loginId = id;
        this.saveId = id != "" ? true : false;
    },
    methods: {
        fLoginProc: function () {
            this.setCookie(
                "LOGIN_ID",
                this.loginId,
                this.saveId == true ? 7 : -1
            );

            //로그인 전에 필수 체크
            if (this.$refs.userId.value == "") {
                alert("로그인 ID를 입력하세요.");
                this.$refs.userId.focus();
                return false;
            } else if (this.$refs.userPwd.value == "") {
                alert("비밀번호를 입력하세요.");
                this.$refs.userPwd.focus();
                return false;
            }

            const params = new URLSearchParams();
            params.append("lgn_Id", this.loginId);
            params.append("pwd", this.pwd);
            this.axios
                .post("/loginProc.do", params)
                .then((res) => {
                    let data = res.data;

                    if (data.result == "SUCCESS") {
                        this.$store.commit("setLoginInfo", {
                            loginId: data.loginId,
                            userNm: data.userNm,
                            userType: data.userType,
                            usrMnuAtrt: data.usrMnuAtrt,
                        });
                        sessionStorage.setItem(
                            "loginInfo",
                            JSON.stringify(data)
                        );
                        sessionStorage.setItem("loginId", data.loginId);
                        this.$router.push("/dashboard");
                    } else {
                        alert("ID 혹은 비밀번호가 틀립니다.");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        setCookie: function (name, value, day) {
            let today = new Date();
            today.setDate(today.getDate() + day);
            document.cookie = `${name}=${value}; path=/; expires=${today.toUTCString()};`;
        },
        getCookie: function (name) {
            let cookie = document.cookie + ";";
            let idx = cookie.indexOf(name, 0);
            let val = "";

            if (idx > -1) {
                cookie = cookie.substring(idx, cookie.length);
                let begin = cookie.indexOf("=", 0) + 1;
                let end = cookie.indexOf(";", begin);
                val = unescape(cookie.substring(begin, end));
            }

            return val;
        },
    },
};
</script>

<style scoped>
@charset "utf-8";

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: "Alata", sans-serif;
}

a {
    text-decoration: none;
    color: #666;
    font-size: 12px;
}

a:hover {
    text-decoration: underline;
    color: black;
}

#background_board {
    width: 100vw;
    height: 100vh;
    background: #eff0f2;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login_form {
    background: #f5f5f5;
    width: 1302px;
    height: 650px;
    display: flex;
    text-align: center;
    box-shadow: var(--bs-box-shadow);
}

.login-form-right-side {
    width: 50%;
    border-radius: 10px 0px 0px 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    background-image: radial-gradient(
        ellipse farthest-corner at 0 140%,
        #5d9dff 0%,
        #2178ff 70%,
        #3585ff 70%
    );
}

.login-form-right-side p {
    padding-top: 50px;
    font-size: 15px;
    text-align: left;
}

.login-form-left-side {
    width: 50%;
    border-radius: 0px 10px 10px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    background: linear-gradient(
        287deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(243, 244, 244, 1) 0%,
        rgba(255, 255, 255, 1) 100%
    );
}

.login-form-left-side fieldset {
    position: relative;
    top: 25%;
}

.login_form .id label,
.login_form .pw label {
    width: 70px;
    line-height: 39px;
    vertical-align: middle;
    font-family: "NanumBarunGothic";
    font-size: 15px;
}

#userId,
#userPwd {
    width: 235px;
    height: 40px;
    line-height: 39px;
    border: 0px;
    color: #5c6371;
    background: #e5e9f2;
    border-radius: 10px;
    appearance: textfield;
    padding: 0 15px;
}

.login_form p.pw {
    margin-top: 12px;
}

.login_form .member_info {
    width: 600px;
    margin: 10px auto;
}

a.btn_login {
    position: absolute;
    top: 170px;
    width: 325px;
    line-height: 52px;
    background: #37ade4;
    color: #fff;
    font-size: 24px;
    left: 150px;
    border-radius: 5rem;
    letter-spacing: 0.1rem;
    cursor: pointer;
}

.member_info > .id_save {
    font-size: 15px;
}

#login-logo {
    width: 300px;
    margin-bottom: 50px;
}

#cb_saveId {
    vertical-align: baseline;
    margin-right: 5px;
}
</style>
