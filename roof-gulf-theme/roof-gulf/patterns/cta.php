<?php
/**
 * Title: دعوة لطلب عرض سعر
 * Slug: roof-gulf/cta
 * Categories: roof-gulf, call-to-action
 */
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"},"margin":{"top":"0"}}},"gradient":"hero","textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-hero-gradient-background has-text-color has-background" style="margin-top:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)"><!-- wp:columns {"verticalAlignment":"center","align":"wide"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"66%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:66%"><!-- wp:heading {"textColor":"base","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-base-color has-text-color has-x-large-font-size">جاهز لبدء مشروعك القادم؟</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"#c9d4e2"}}} -->
<p class="has-text-color" style="color:#c9d4e2">تواصل معنا اليوم واحصل على استشارة ومعاينة مجانية وعرض سعر مفصّل خلال 48 ساعة.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"left"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">اطلب عرض سعر</a></div>
<!-- /wp:button -->

<!-- wp:button {"backgroundColor":"base","textColor":"primary"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-primary-color has-base-background-color has-text-color has-background wp-element-button" href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', roof_gulf_contact( 'phone' ) ) ); ?>">اتصل بنا</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
