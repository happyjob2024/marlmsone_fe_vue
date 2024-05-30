<script setup>
import { ref } from "vue";
import PostCodeModal from "./PostCodeModal.vue";
import axios from "axios";
import { nullcheck } from "@/common/common";
import { SignUp } from "@/api/api";
import {
    preventNotNumberInput,
    validateEmail,
    validateId,
    validatePassword,
    validateTel,
} from "@/common/validation";

const emit = defineEmits(["closeModal"]);

const postCodeModalFlag = ref(false);

const type = ref("");
const id = ref("");
const checkedId = ref("");
const isCheckedId = ref(undefined);
const pwd = ref("");
const pwdCheck = ref("");
const name = ref("");
const gender = ref("");
const birthday1 = ref("");
const birthday2 = ref("");
const tel = ref("");
const email = ref("");
const zipCode = ref("");
const addr = ref("");
const addr_dtl = ref("");

const closeModal = (event) => {
    if (!event) {
        emit("closeModal");
    } else if (event.target.classList.contains("background")) {
        emit("closeModal");
    }
};

const signup = () => {
    if (isCheckedId.value === undefined) {
        alert("중복된 아이디가 있는지 확인해 주세요.");
        return;
    } else if (!isCheckedId.value) {
        alert("중복된 아이디입니다.\n다른 아이디를 입력해 주세요.");
        return;
    } else if (id.value !== checkedId.value) {
        alert(
            "중복이 확인된 아이디가 아닙니다.\n중복된 아이디가 있는지 확인해 주세요."
        );
        return;
    }

    if (!validatePassword(pwd.value)) {
        alert("올바른 비밀번호를 입력해 주세요.");
        return;
    }

    if (pwd.value !== pwdCheck.value) {
        alert("비밀번호와 비밀번호 확인이 같은지 확인해 주세요.");
        return;
    }

    if (!validateBirthDay()) {
        alert("올바른 주민등록번호를 입력해 주세요.");
        return;
    }

    if (!validateTel(tel.value)) {
        alert("올바른 전화번호를 입력해 주세요.");
        return;
    }

    if (!validateEmail(email.value)) {
        alert("올바른 이메일을 입력해 주세요.");
        return;
    }

    let checkresult = nullcheck([
        { inval: name.value, msg: "이름을 입력해 주세요." },
        { inval: gender.value, msg: "성별을 선택해 주세요." },
        { inval: zipCode.value, msg: "주소를 입력해 주세요." },
        { inval: addr.value, msg: "주소를 입력해 주세요." },
    ]);
    if (!checkresult) return;

    const params = new URLSearchParams();
    params.append("action", "I");
    params.append("user_type", type.value);
    params.append("loginID", id.value);
    params.append("name", name.value);
    params.append("password", pwd.value);
    params.append("tel", tel.value);
    params.append("gender_cd", gender.value);
    params.append("user_email", email.value);
    params.append("user_zipcode", zipCode.value);
    params.append("user_address", addr.value);
    params.append("user_dt_address", addr_dtl.value);
    params.append("birthday1", birthday1.value);
    params.append("birthday2", birthday2.value);

    axios
        .post(SignUp.Register, params)
        .then((res) => {
            if (res.data.result === "SUCCESS") {
                alert(res.data.resultMsg);
                closeModal();
            } else {
                alert(res.data.resultMsg);
            }
        })
        .catch((_) => {
            alert("회원가입에 실패했습니다.");
        });
};

const checkId = () => {
    if (!validateId(id.value)) {
        alert("올바른 아이디를 입력해 주세요.");
        return;
    }

    axios
        .post(SignUp.CheckId, null, { params: { loginID: id.value } })
        .then((res) => {
            if (res.data === 1) {
                alert("중복된 아이디가 존재합니다.");
                isCheckedId.value = false;
            } else if (res.data === 0) {
                alert("사용할 수 있는 아이디입니다.");
                isCheckedId.value = true;
                checkedId.value = id.value;
            }
        })
        .catch((_) => {
            alert("아이디 중복확인을 실패했습니다.");
        });
};

const addAddress = (data) => {
    addr.value = data.address;
    zipCode.value = data.zonecode;
    postCodeModalFlag.value = false;
};

const validateBirthDay = () => {
    return birthday1.value.length === 6 && birthday2.value.length === 7;
};
</script>

<template>
    <div class="modal show">
        <div class="background" @click="closeModal">
            <div class="main">
                <p class="title">회원가입</p>
                <table>
                    <colgroup>
                        <col width="25%" />
                        <col width="25%" />
                        <col width="25%" />
                        <col width="25%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="col">
                                회원유형<span class="font_red">*</span>
                            </th>
                            <td
                                colspan="3"
                                style="height: 40px; font-size: 15px"
                            >
                                <input
                                    id="studnet"
                                    name="type"
                                    type="radio"
                                    value="A"
                                    style="margin-left: 6px"
                                    v-model="type"
                                />
                                <label for="studnet" style="margin-left: 2px">
                                    학생
                                </label>
                                <input
                                    id="teacher"
                                    name="type"
                                    type="radio"
                                    value="B"
                                    style="margin-left: 6px"
                                    v-model="type"
                                />
                                <label for="teacher" style="margin-left: 2px">
                                    강사
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">
                                아이디<span class="font_red">*</span>
                            </th>
                            <td colspan="2">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="숫자, 영문자만 사용하여 6~20자리"
                                    maxlength="20"
                                    v-model="id"
                                />
                            </td>
                            <td>
                                <button
                                    class="btn btn-primary mx-2"
                                    @click="checkId"
                                >
                                    중복확인
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">
                                비밀번호<span class="font_red">*</span>
                            </th>
                            <td colspan="3">
                                <input
                                    type="password"
                                    class="form-control"
                                    placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                    v-model="pwd"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">
                                비밀번호 확인<span class="font_red">*</span>
                            </th>
                            <td colspan="3">
                                <input
                                    type="password"
                                    class="form-control"
                                    v-model="pwdCheck"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">
                                이름<span class="font_red">*</span>
                            </th>
                            <td>
                                <input
                                    type="text"
                                    class="form-control"
                                    maxlength="10"
                                    v-model="name"
                                />
                            </td>
                            <th scope="col">
                                성별<span class="font_red">*</span>
                            </th>
                            <td>
                                <select
                                    id="genderId"
                                    class="form-control"
                                    v-model="gender"
                                >
                                    <option
                                        value=""
                                        selected="selected"
                                        disabled
                                    >
                                        선택
                                    </option>
                                    <option value="M">남자</option>
                                    <option value="F">여자</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">
                                주민등록번호<span class="font_red">*</span>
                            </th>
                            <td colspan="3">
                                <input
                                    type="text"
                                    class="form-control"
                                    maxLength="6"
                                    style="width: 47%; display: inline"
                                    v-model="birthday1"
                                    @keydown="preventNotNumberInput"
                                />
                                -
                                <input
                                    type="text"
                                    class="form-control"
                                    maxLength="7"
                                    style="width: 47%; display: inline"
                                    v-model="birthday2"
                                    @keydown="preventNotNumberInput"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">
                                전화번호<span class="font_red">*</span>
                            </th>
                            <td colspan="3">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="핸드폰 번호를 숫자만 입력하세요."
                                    maxLength="11"
                                    v-model="tel"
                                    @keydown="preventNotNumberInput"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">
                                이메일<span class="font_red">*</span>
                            </th>
                            <td colspan="3">
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="email"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">
                                우편번호<span class="font_red">*</span>
                            </th>
                            <td colspan="2">
                                <input
                                    type="text"
                                    class="form-control"
                                    style="width: 252px; display: inline"
                                    disabled
                                    v-model="zipCode"
                                />
                            </td>
                            <td>
                                <button
                                    class="btn btn-primary mx-2"
                                    @click="postCodeModalFlag = true"
                                >
                                    우편번호 찾기
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">
                                주소<span class="font_red">*</span>
                            </th>
                            <td colspan="3">
                                <input
                                    type="text"
                                    class="form-control"
                                    disabled
                                    v-model="addr"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">상세주소</th>
                            <td colspan="3">
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="addr_dtl"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="buttons">
                    <button class="btn btn-primary" @click="signup">
                        회원가입
                    </button>
                    <button class="btn btn-primary" @click="closeModal()">
                        취소
                    </button>
                </div>
            </div>
        </div>
        <PostCodeModal
            v-if="postCodeModalFlag"
            @closeModal="postCodeModalFlag = false"
            @complete="addAddress"
        />
    </div>
</template>

<style scoped>
.main {
    width: 520px;
}
</style>
