<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <el-badge :value="total" :max="999" class="danger-badge">
        <router-link :to="'/warning/logs'">
          <svg-icon icon-class="warning" class-name="warning-style"/>
        </router-link>
      </el-badge>
      <div class="divider">|</div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-image :src="avatarUrl" class="user-avatar"/>
          <span>{{ name }}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <scroll-bar class="seamless-scroll"/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ScrollBar from '@/components/scrollBar'
import {getListCount} from "@/api/warningLog";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ScrollBar
  },
  data() {
    return {
      avatarUrl: "",
      total: '',
      getWarnCountTimer:null,
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    getWarnCount() {
      getListCount().then(res => {
        this.total = res.count;
      }).finally(() => {
        this.listLoading = false
      })
    },
  },
  mounted() {
    this.avatarUrl = this.$conf.resource.baseUrl + this.avatar;
    this.getWarnCount();
    this.getWarnCountTimer = setInterval(() => {
      this.getWarnCount();
    }, 1000 * 60 * 60);
  },
  beforeDestroy() {
    this.getWarnCountTimer && clearInterval(this.getWarnCountTimer);
  }
}
</script>

<style scoped>

.danger-badge /deep/ .el-badge__content.is-fixed {
  top: 8px;
  right: 10px;
}
</style>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .seamless-scroll {
    float: right;
    margin-right: 30px;
    margin-top: 10px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .danger-badge {
      margin-top: 5px;

      .warning-style {
        font-size: 22px;
      }
    }

    .divider {
      display: inline-block;
      margin: 0px 15px;
    }

    .avatar-container {
      position: relative;
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin-right: 10px;
          line-height: 20px;
          text-align: center;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          //top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
