import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate,Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Home from './screen/Home';
import Community from './screen/Community';
import User from './screen/User';
import Coupon from './screen/Coupon';
import Order from './screen/Order';
import AgentOrder from './screen/AgentOrder';
import RequestOrder from './screen/RequestOrder';
import SystemGuide from './SystemGuide';
import Franchisee from './screen/Franchisee';
import Control from './screen/Control';
import Savings from './screen/Savings';
import Config from './screen/Config';
import Product from './screen/Product';
import Coin from './screen/Coin';
import Board from './screen/Community/Board';
import DynamicBoard from './screen/Community/Board/DynamicBoard';
import Admin from './screen/Community/Board/Admin';
import MemberList from './screen/User/MemberList';
import FranchiseeList from './screen/User/FranchiseeList';
import PartnerList from './screen/User/PartnerList';
import DealerList from './screen/User/DealerList';
import ReferrerStats from './screen/User/ReferrerStats';
import IdentityVerificationList from './screen/User/IdentityVerificationList';
import PurchaseGrade from './screen/User/PurchaseGrade';
import AppInstallation from './screen/User/AppInstallation';
import FranchiseeMemberList from './screen/User/FranchiseeMemberList';
import PointManagement from './screen/User/PointManagement';
import PermissionManagement from './screen/User/PermissionManagement';
import Partners from './screen/User/Partners';
import CouponTypes from './screen/Coupon/CouponTypes';
import CouponSets from './screen/Coupon/CouponSets';
import CouponStats from './screen/Coupon/CouponStats';
import AllCoupons from './screen/Coupon/AllCoupons';
import VerifiedCoupons from './screen/Coupon/VerifiedCoupons';
import PosSettlement from './screen/Coupon/PosSettlement';
import PosLog from './screen/Coupon/PosLog';
import SocialCouponIssuance from './screen/Coupon/SocialCouponIssuance';
import YoutubePremium from './screen/Coupon/YoutubePremium';
import AllOrders from './screen/Order/AllOrders';
import PaymentComplete from './screen/Order/PaymentComplete';
import WaitingForDeposit from './screen/Order/WaitingForDeposit';
import RefundRequest from './screen/Order/RefundRequest';
import RefundComplete from './screen/Order/RefundComplete';
import CreditCardPgAdmin from './screen/Order/CreditCardPgAdmin';
import TempOrder from './screen/Order/TempOrder';
import QueueManagement from './screen/Order/QueueManagement';
import SalesStats from './screen/Order/SalesStats';
import AgencyFailure from './screen/Order/AgencyFailure';
import InspectionComplete from './screen/Order/InspectionComplete';
import RefundManagement from './screen/Order/RefundManagement';
import AccidentManagement from './screen/Order/AccidentManagement';
import CancellationManagement from './screen/Order/CancellationManagement';
import OtherDeposits from './screen/Order/OtherDeposits';
import TimeControl from './screen/Control/TimeControl';
import PopupControl from './screen/Control/PopupControl';
import GroupTheaterControl from './screen/Control/GroupTheaterControl';
import ChargeHistory from './screen/Savings/ChargeHistory';
import UsageHistory from './screen/Savings/UsageHistory';
import Navigator from './components/Navigator';
import UsedCoupons from './screen/Coupon/VerifiedCoupons';
import DefaultBoard from './screen/Community/Board/DefaultBoard';
import StandardInfo from './screen/Community/StandardInfo';
import { Login, RegisterForm } from './components/Login';
import { useApp } from './AppContext';
import CouponEdit from  './Forms/CouponEdit';
import MessageSend from  './Forms/MessageSend';

import StandardInfo_Dtl from './screen/Community/StandardInfo_Dtail';
import ControlInfo from './screen/Community/ContorlInfo';
import {Statistic} from './screen/Statistic';
import  DataTable from './Forms/OrderManagers';
import OrderModify from './Forms/OrderModify';
import AddUserForm from './Forms/AddUserForm';
import Price from './screen/Price';
export default function App() {
  let navigate = useNavigate();
  const { isLoggedIn, user } = useApp();

  useEffect(() => {
    if (!isLoggedIn && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="App">
      {isLoggedIn && (
        <header className="App-header">
          <Navigator />
        </header>
      )}
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />} >
            
            <Route path="/" element={<Navigate to="StatisticList" replace />} />
              <Route path="OrderManager" element={<DataTable />} />
              <Route path="CouponEdit" element={<CouponEdit />} />
              <Route path="OrderModify" element={<OrderModify />} />
              <Route path="MessageSend" element={<MessageSend />} />
              <Route path="Board" element={<Board />} />
              <Route path="BoardAdmin" element={<Admin />} />
              <Route path="PostAdmin" element={<DefaultBoard />} />
              <Route path="StandardInfo" element={<StandardInfo />} />
              <Route path="StandardInfo_Dtl" element={<StandardInfo_Dtl />} />
              <Route path="ControlInfo" element={<ControlInfo />} />
              <Route path="SystemGuide" element={<SystemGuide />} />
              <Route path="StatisticList" element={<Statistic
                systemMetrics={{
                   memoryTotal: 16,
                   memoryUsed: 8,
                   diskTotal: 1000,
                   diskUsed: 400,
                   cpuHistory: [20, 25, 30, 28, 35, 40, 38],
                   networkHistory: [50, 60, 55, 70, 65, 80, 75],
                 }}
               />} />
          
               <Route path="Board/:Id" element={<DynamicBoard />} />  
               </Route>
            <Route path="/Community" element={<Community />}>
              <Route path="OrderManager" element={<DataTable />} />
              <Route path="CouponEdit" element={<CouponEdit />} />
              <Route path="OrderModify" element={<OrderModify />} />
              <Route path="MessageSend" element={<MessageSend />} />
              <Route path="Board" element={<Board />} />
              <Route path="BoardAdmin" element={<Admin />} />
              <Route path="PostAdmin" element={<DefaultBoard />} />
              <Route path="StandardInfo" element={<StandardInfo />} />
              <Route path="StandardInfo_Dtl" element={<StandardInfo_Dtl />} />
              <Route path="ControlInfo" element={<ControlInfo />} />
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/User" element={<User />}>
              <Route path="member-list" element={<MemberList />} />
              <Route path="join" element={<AddUserForm />} />
              <Route path="franchisee-list" element={<FranchiseeList />} />
              <Route path="partner-list" element={<PartnerList />} />
              <Route path="dealer-list" element={<DealerList />} />
              <Route path="referrer-stats" element={<ReferrerStats />} />
              <Route path="identity-verification-list" element={<IdentityVerificationList />} />
              <Route path="purchase-grade" element={<PurchaseGrade />} />
              <Route path="Board/:Id" element={<DynamicBoard />} />
              <Route path="app-installation" element={<AppInstallation />}>
                <Route path="franchisee-member-list" element={<FranchiseeMemberList />} />
                <Route path="point-management" element={<PointManagement />} />
              </Route>
              <Route path="point-management" element={<PointManagement />} />
              <Route path="permission-management" element={<PermissionManagement />} />
              <Route path="partners" element={<Partners />} />
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/Coupon" element={<Coupon />}>
              <Route path="coupon-types" element={<CouponTypes />} />
              <Route path="coupon-sets" element={<CouponSets />} />
              <Route path="coupon-stats" element={<CouponStats />} />
              <Route path="all-coupons" element={<AllCoupons />} />
              <Route path="verified-coupons" element={<VerifiedCoupons />} />
              <Route path="used-coupons" element={<UsedCoupons />} />
              <Route path="pos-settlement" element={<PosSettlement />} />
              <Route path="pos-log" element={<PosLog />} />
              <Route path="social-coupon-issuance" element={<SocialCouponIssuance />} />
              <Route path="youtube-premium" element={<YoutubePremium />} />
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/Order" element={<Order />}>
              <Route path="all-orders" element={<AllOrders />} />
              <Route path="payment-complete" element={<PaymentComplete />} />
              <Route path="waiting-for-deposit" element={<WaitingForDeposit />} />
              <Route path="refund-request" element={<RefundRequest />} />
              <Route path="refund-complete" element={<RefundComplete />} />
              <Route path="credit-card-pg-admin" element={<CreditCardPgAdmin />} />
              <Route path="temp-order" element={<TempOrder />} />
              <Route path="queue-management" element={<QueueManagement />} />
              <Route path="sales-stats" element={<SalesStats />} />
              <Route path="agency-failure" element={<AgencyFailure />} />
              <Route path="inspection-complete" element={<InspectionComplete />} />
              <Route path="refund-management" element={<RefundManagement />} />
              <Route path="accident-management" element={<AccidentManagement />} />
              <Route path="cancellation-management" element={<CancellationManagement />} />
              <Route path="other-deposits" element={<OtherDeposits />} />
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/RequestOrder" element={<RequestOrder />}>
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/AgentOrder" element={<AgentOrder />}>
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/Franchisee" element={<Franchisee />}>
              <Route path="franchisee-list" element={<FranchiseeList />} />
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/Control" element={<Control />}>
              <Route path="time-control" element={<TimeControl />} />
              <Route path="popup-control" element={<PopupControl />} />
              <Route path="group-theater-control" element={<GroupTheaterControl />} />
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/Savings" element={<Savings />}>
              <Route path="charge-history" element={<ChargeHistory />} />
              <Route path="usage-history" element={<UsageHistory />} />
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/Config" element={<Config />}>
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/Product" element={<Product />}>
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/Coin" element={<Coin />}>
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
            <Route path="/Price" element={<Price />}>
              <Route path="Board/:Id" element={<DynamicBoard />} />
            </Route>
           
          </>
        ) : (
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </div>
  );
}
