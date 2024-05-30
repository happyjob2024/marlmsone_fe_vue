<template>
    <h3 class="hidden">lnb 영역</h3>
    <div id="lnb_area">
        <div class="logo">
            <div div id="header">
                <router-link :to="'/dashboard/home'">
                    <a class="logo">
                        <img
                            id="logoImg"
                            src="@/assets/images/admin/login/logo_img.png"
                        />
                    </a>
                </router-link>
            </div>
        </div>
        <div class="login">
            <template v-if="loginInfo.loginId">
                <img
                    src="@/assets/images/admin/comm/left_myImg.jpg"
                    class="LoginImg"
                    alt="사진"
                />
                <router-link class="name" to="/dashboard/mypage">{{
                    loginInfo.name
                }}</router-link>
                <div class="btn_loginArea">
                    <button type="button" @click="logoutProc">LOGOUT</button>
                </div>
            </template>
        </div>
        <ul class="lnbMenu" :style="{ paddingLeft: '0px' }">
            <template v-for="(list, index) in loginInfo.menulist" :key="index">
                <li>
                    <dl :style="{ marginBottom: '0px' }">
                        <!-- 대분류 메뉴 -->
                        <dt>
                            <a
                                class="lnbBtn menu005"
                                :class="list.isShow == true ? 'on' : ''"
                                href="#"
                                @click="slideDown(index, $event)"
                                >{{ list.mnu_nm }}
                            </a>
                        </dt>

                        <!-- 소분류 메뉴 -->
                        <slide v-model="list.isShow" :duration="400">
                            <dd>
                                <template
                                    v-for="item in list.nodeList"
                                    :key="item.mnu_id"
                                >
                                    <router-link
                                        :to="
                                            '/dashboard' +
                                            item.mnu_url?.replace('.do', '')
                                        "
                                        >- {{ item.mnu_nm }}</router-link
                                    >
                                </template>
                            </dd>
                        </slide>
                    </dl>
                </li>
            </template>
        </ul>
        <div style="clear: both"></div>
    </div>
</template>

<script>
import SlideUpDown from "vue3-slide-up-down";
import { mapState, mapGetters } from "vuex";

export default {
    name: "leftMenu",
    data: function () {
        return {
            loginInfo: {
                menulist: [],
                loginId: "",
                name: "",
            },
        };
    },
    computed: {
        ...mapState(["counter", "loginInfo"]),
        ...mapGetters(["getCounter"]),
    },
    components: { slide: SlideUpDown },
    mounted: function () {
        const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
        loginInfo.usrMnuAtrt.forEach((item) => {
            item.isShow = false;
        });

        this.loginInfo.loginId = loginInfo.loginId;
        this.loginInfo.name = loginInfo.userNm;
        this.loginInfo.menulist = loginInfo.usrMnuAtrt;
    },
    methods: {
        logoutProc() {
            this.$store.commit("setLogout");
            this.$router.push("/login");
        },
        slideDown: function (index, event) {
            event.preventDefault();
            // slide down chosen menu list
            this.loginInfo.menulist[index].isShow =
                !this.loginInfo.menulist[index].isShow;

            // slideUp exept choose one
            for (let i = 0; i < this.loginInfo.menulist.length; i++) {
                if (i != index) {
                    this.loginInfo.menulist[i].isShow = false;
                }
            }
        },
    },
};
</script>

<style></style>
