<script setup>
import { MyPage } from "@/api/api";
import PostCodeModal from "../components/modals/user/PostCodeModal.vue";
import UpdatePasswordModal from "../components/modals/user/UpdatePasswordModal.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { nullcheck } from "@/common/common";
import {
    preventNotNumberInput,
    validateEmail,
    validateTel,
} from "@/common/validation";

const router = useRouter();

const user = ref({});
const password = ref("");

const postCodeModalFlag = ref(false);
const passowrdModalFlag = ref(false);

const updateUserInfo = async () => {
    if (!validateTel(user.value.tel)) {
        alert("올바른 전화번호를 입력해 주세요.");
        return;
    }

    if (!validateEmail(user.value.mail)) {
        alert("올바른 이메일을 입력해 주세요.");
        return;
    }

    let checkresult = nullcheck([
        { inval: user.value.zipcode, msg: "주소를 입력해 주세요." },
        { inval: user.value.addr, msg: "주소를 입력해 주세요." },
    ]);
    if (!checkresult) return;

    if (!(await checkPassword())) {
        alert("비밀번호가 틀립니다.");
        return;
    }

    const params = new URLSearchParams();
    params.append("zipcode", user.value.zipcode);
    params.append("addr", user.value.addr);
    params.append("addr_dtl", user.value.addr_dtl);
    params.append("tel", user.value.tel);
    params.append("mail", user.value.mail);
    params.append("loginId", user.value.loginId);

    axios
        .post(MyPage.Update, params)
        .then((res) => {
            if (res.data.result === "S") {
                alert("성공적으로 수정했습니다.");
                password.value = "";
            } else {
                alert("수정을 실패 했습니다.");
            }
        })
        .catch((_) => alert("수정을 실패 했습니다."));
};

const userQuit = async () => {
    const rightPwd = await checkPassword();

    if (!rightPwd) {
        alert("비밀번호가 틀립니다.");
        return;
    }

    if (window.confirm("정말 탈퇴하겠습니까?")) {
        axios
            .post(MyPage.Quit)
            .then((res) => {
                if (res.data.resultmsg === "SUCCESS") {
                    alert("성공적으로 탈퇴하였습니다.");
                    router.push("/");
                } else {
                    alert("탈퇴에 실패했습니다.");
                }
            })
            .catch((_) => {
                alert("탈퇴에 실패했습니다.");
            });
    }
};

const checkPassword = async () => {
    try {
        const res = await axios.post(MyPage.CheckPassword, null, {
            params: { password: password.value },
        });

        return res.data.resultmsg === "SUCCESS";
    } catch (err) {
        return false;
    }
};

const addAddress = (data) => {
    user.value.addr = data.address;
    user.value.zipcode = data.zonecode;
    postCodeModalFlag.value = false;
};

onMounted(() => {
    axios.post(MyPage.Get).then((res) => {
        user.value = res.data.userInfo;
    });
});
</script>

<template>
    <div class="content">
        <p class="Location">
            <span class="btn_nav bold">My Page</span>
        </p>

        <p class="conTitle">
            <span>사용자 정보</span>
        </p>

        <div>
            <table class="col">
                <colgroup>
                    <col width="12%" />
                    <col width="23%" />
                    <col width="15%" />
                    <col width="12%" />
                    <col width="23%" />
                    <col width="15%" />
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="col">아이디</th>
                        <td scope="col" colspan="2">
                            <span class="form-control textL">{{
                                user.loginId
                            }}</span>
                        </td>
                        <th scope="col">이름</th>
                        <td scope="col" colspan="2">
                            <span class="form-control textL">{{
                                user.name
                            }}</span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            비밀번호 확인<span class="font_red"> *</span>
                        </th>
                        <td scope="col">
                            <input
                                type="password"
                                class="form-control"
                                v-model="password"
                                placeholder="수정 시 비밀번호가 필요합니다."
                            />
                        </td>
                        <td scope="col">
                            <button
                                class="btn btn-primary"
                                @click="passowrdModalFlag = true"
                            >
                                비밀번호 변경
                            </button>
                        </td>
                        <th scope="col">
                            우편번호<span class="font_red"> *</span>
                        </th>
                        <td scope="col">
                            <span class="form-control textL">{{
                                user.zipcode
                            }}</span>
                        </td>
                        <td scope="col">
                            <button
                                class="btn btn-primary"
                                @click="postCodeModalFlag = true"
                            >
                                우편번호 찾기
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            이메일<span class="font_red"> *</span>
                        </th>
                        <td scope="col" colspan="2">
                            <input
                                type="text"
                                class="form-control"
                                v-model="user.mail"
                            />
                        </td>
                        <th scope="col">
                            주소<span class="font_red"> *</span>
                        </th>
                        <td scope="col" colspan="2">
                            <span class="form-control textL">{{
                                user.addr
                            }}</span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            연락처<span class="font_red"> *</span>
                        </th>
                        <td scope="col" colspan="2">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="핸드폰 번호를 숫자만 입력됩니다."
                                maxlength="11"
                                v-model="user.tel"
                                @keydown="preventNotNumberInput"
                            />
                        </td>
                        <th scope="col">상세주소</th>
                        <td scope="col" colspan="2">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="동, 층, 호수를 입력해주세요"
                                v-model="user.addr_dtl"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="buttons">
            <button class="btn btn-primary" @click="updateUserInfo">
                저장
            </button>
            <button class="btn btn-primary" @click="userQuit">탈퇴하기</button>
        </div>
    </div>
    <PostCodeModal
        v-if="postCodeModalFlag"
        @closeModal="postCodeModalFlag = false"
        @complete="addAddress"
    />
    <UpdatePasswordModal
        v-if="passowrdModalFlag"
        @closeModal="passowrdModalFlag = false"
    />
</template>

<style scoped>
th {
    text-align: center;
}

td input {
    padding-left: 12px;
}

td span {
    height: 100%;
    background-color: #d9d9d9;
}

input::placeholder {
    font-size: 12px;
}

.btn {
    padding: 6px;
}

.buttons {
    text-align: center;
    margin-top: 20px;
}

.buttons .btn:first-child {
    margin-right: 15px;
}
</style>
