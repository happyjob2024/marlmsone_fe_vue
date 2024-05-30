<script setup>
import { MyPage } from "@/api/api";
import { validatePassword } from "@/common/validation";
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
    if (!validatePassword(newPwd.value)) {
        alert("올바른 새 비밀번호를 입력해 주세요.");
        return;
    }

    if (newPwd.value !== newPwdCheck.value) {
        alert("새 비밀번호와 새 비밀번호 확인은 같아야합니다.");
        return;
    }

    if (!validatePassword(pwd.value)) {
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
</script>

<template>
    <div class="modal show">
        <div class="background" @click="closeModal">
            <div class="main">
                <p class="title">비밀번호 변경</p>
                <table>
                    <colgroup>
                        <col width="140px" />
                        <col width="255px" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th
                                class="font_red"
                                colspan="2"
                                style="height: 60px"
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
                                    class="form-control"
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
                                    class="form-control"
                                    placeholder="새 비밀번호와 동일한 비밀번호"
                                    v-model="newPwdCheck"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                현재 비밀번호<span class="font_red"> *</span>
                            </th>
                            <td>
                                <input
                                    type="password"
                                    class="form-control"
                                    placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                    v-model="pwd"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="buttons">
                    <button class="btn btn-primary" @click="save()">
                        저장
                    </button>
                    <button class="btn btn-primary" @click="closeModal()">
                        취소
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
td input {
    height: 35px;
    width: 100%;
    padding: 10px;
}
</style>
