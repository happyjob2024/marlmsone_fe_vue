<script setup>
import { MyPage } from "@/api/api";
import axios from "axios";
import { ref } from "vue";

const emit = defineEmits(["closeModal", "complete"]);

const pwd = ref("");
const newPwd = ref("");
const newPwdCheck = ref("");

const closeModal = (event) => {
    if (!event) {
        emit("closeModal");
    } else if (event.target.classList.contains("background")) {
        emit("closeModal");
    }
};

const save = () => {
    if (!validatePwd(newPwd.value)) {
        alert("올바른 새 비밀번호를 입력해 주세요.");
        return;
    }

    if (newPwd.value !== newPwdCheck.value) {
        alert("새 비밀번호와 새 비밀번호 확인은 같아야합니다.");
        return;
    }

    if (!validatePwd(pwd.value)) {
        alert("올바른 비밀번호를 입력해 주세요.");
        return;
    }

    if (newPwd.value === pwd.value) {
        alert("현재 비밀번호와 같은 비밀번호로 설정할 수 없습니다.");
        return;
    }

    const params = new URLSearchParams({
        newPsd: newPwd.value,
        originPwd: pwd.value,
    });

    axios
        .post(MyPage.UpdatePassword, params)
        .then((res) => {
            if (res.data.resultmsg === "FAIL2") {
                alert("현재 비밀번호와 같은 비밀번호로 설정할 수 없습니다.");
            } else if (res.data.resultmsg === "FAIL3") {
                alert("현재 비밀번호가 일치하지 않습니다.");
            } else if (res.data.resultmsg === "FAIL1") {
                alert("비밀번호 변경에 실패하였습니다.");
            } else {
                alert("비밀번호를 변경하였습니다.");
                closeModal();
            }
        })
        .catch((_) => alert("비밀번호 변경에 실패하였습니다."));
};

const validatePwd = (p) => {
    return /^(?=.*\d)(?=.*\w)(?=.*[!@#$%^&+=])[\w\d!@#$%^&+=]{8,15}$/.test(p);
};
</script>

<template>
    <div class="background" @click="closeModal">
        <div class="main">
            <h3 class="title">
                <span>비밀번호 변경</span>
            </h3>
            <table>
                <colgroup>
                    <col width="140px" />
                    <col width="255px" />
                </colgroup>
                <tbody>
                    <tr>
                        <th
                            colspan="2"
                            style="
                                text-align: center;
                                background-color: #f9f9f9;
                                color: red;
                                height: 60px;
                                font-size: 10pt;
                            "
                        >
                            *사용한 적 없는 비밀번호가 안전합니다.<br />
                            새로운 비밀번호로 변경해주세요.
                        </th>
                    </tr>
                    <tr>
                        <th>새 비밀번호<span class="font_red"> *</span></th>
                        <td>
                            <input
                                type="password"
                                placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                v-model="newPwd"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            새 비밀번호 확인<span class="font_red"> *</span>
                        </th>
                        <td>
                            <input
                                type="password"
                                placeholder="새 비밀번호와 동일한 비밀번호"
                                v-model="newPwdCheck"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>현재 비밀번호<span class="font_red"> *</span></th>
                        <td>
                            <input
                                type="password"
                                placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                v-model="pwd"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="buttons">
                <button class="btn btn-primary" @click="save()">저장</button>
                <button class="btn btn-primary" @click="closeModal()">
                    취소
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
h3 {
    margin: 0;
    padding: 10px;
    background-color: #dddddd;
}

th {
    text-align: center;
    font-size: 12px;
    background-color: rgb(212, 212, 212);
}

td {
    padding: 0 5px;
}

td input {
    border: none;
    height: 35px;
    width: 100%;
}

input::placeholder {
    font-size: 12px;
}

.background {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: -webkit-fill-available;
    height: -webkit-fill-available;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
}

.main {
    padding: 20px;
    background: gray;
}

.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.btn {
    font-size: 12px;
}

.btn:first-child {
    margin-right: 5px;
}
</style>
