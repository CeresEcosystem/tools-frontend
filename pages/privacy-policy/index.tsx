import TextContainer from '@components/text_container';
import Paragraph from '@components/text_container/paragraph';
import ParagraphList from '@components/text_container/paragraph_list';
import ParagraphTitle from '@components/text_container/paragraph_title';

export default function PrivacyPolicy() {
  return (
    <>
      <TextContainer>
        <ParagraphTitle title="Privacy Policy" />
        <br />
        <Paragraph paragraph="At Ceres Tools, accessible from https://tools.cerestoken.io, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Ceres Tools and how we use it." />
        <br />
        <Paragraph paragraph="If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us." />
        <br />
        <Paragraph paragraph="This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Ceres Tools. This policy is not applicable to any information collected offline or via channels other than this website." />
        <ParagraphTitle title="Consent" />
        <br />
        <Paragraph paragraph="By using our website, you hereby consent to our Privacy Policy and agree to its terms." />
        <ParagraphTitle title="Information we collect" />
        <br />
        <Paragraph paragraph="The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information." />
        <br />
        <Paragraph paragraph="If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide." />
        <br />
        <Paragraph paragraph="When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number." />
        <ParagraphTitle title="How we use your information" />
        <br />
        <Paragraph paragraph="We use the information we collect in various ways, including to:" />
        <ParagraphList
          list={[
            'Provide, operate, and maintain our website',
            'Improve, personalize, and expand our website',
            'Understand and analyze how you use our website',
            'Develop new products, services, features, and functionality',
            'Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes',
            'Send you emails',
            'Find and prevent fraud',
          ]}
        />
        <ParagraphTitle title="Log Files" />
        <br />
        <Paragraph paragraph="Ceres Tools follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information." />
        <ParagraphTitle title="Advertising Partners Privacy Policies" />
        <br />
        <Paragraph paragraph="You may consult this list to find the Privacy Policy for each of the advertising partners of Ceres Tools." />
        <br />
        <Paragraph paragraph="Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Ceres Tools, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit." />
        <br />
        <Paragraph paragraph="Note that Ceres Tools has no access to or control over these cookies that are used by third-party advertisers." />
        <ParagraphTitle title="Third Party Privacy Policies" />
        <br />
        <Paragraph paragraph="Ceres Tools's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options." />
        <br />
        <Paragraph paragraph="You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites." />
        <ParagraphTitle title="CCPA Privacy Rights (Do Not Sell My Personal Information)" />
        <br />
        <Paragraph paragraph="Under the CCPA, among other rights, California consumers have the right to:" />
        <br />
        <Paragraph paragraph="Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers." />
        <br />
        <Paragraph paragraph="Request that a business delete any personal data about the consumer that a business has collected." />
        <br />
        <Paragraph paragraph="Request that a business that sells a consumer's personal data, not sell the consumer's personal data." />
        <br />
        <Paragraph paragraph="If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us." />
        <ParagraphTitle title="GDPR Data Protection Rights" />
        <br />
        <Paragraph paragraph="We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:" />
        <br />
        <Paragraph paragraph="The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service." />
        <br />
        <Paragraph paragraph="The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete." />
        <br />
        <Paragraph paragraph="The right to erasure – You have the right to request that we erase your personal data, under certain conditions." />
        <br />
        <Paragraph paragraph="The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions." />
        <br />
        <Paragraph paragraph="The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions." />
        <br />
        <Paragraph paragraph="The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions." />
        <br />
        <Paragraph paragraph="If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us." />
        <ParagraphTitle title="Children's Information" />
        <br />
        <Paragraph paragraph="Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity." />
        <br />
        <Paragraph paragraph="Ceres Tools does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records." />
        <ParagraphTitle title="Changes to This Privacy Policy" />
        <br />
        <Paragraph paragraph="We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page." />
        <br />
        <Paragraph paragraph="Our Privacy Policy was created with the help of the Privacy Policy Generator." />
        <ParagraphTitle title="Contact Us" />
        <br />
        <Paragraph paragraph="If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us." />
      </TextContainer>
    </>
  );
}
