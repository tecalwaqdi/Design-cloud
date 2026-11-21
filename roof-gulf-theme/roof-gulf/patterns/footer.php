<?php
/**
 * Title: الفوتر
 * Slug: roof-gulf/footer
 * Categories: footer, roof-gulf
 * Block Types: core/template-part/footer
 * Inserter: no
 */
?>
<!-- wp:group {"className":"rg-footer","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|40"},"margin":{"top":"0"}}},"backgroundColor":"primary-dark","textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group rg-footer has-base-color has-primary-dark-background-color has-text-color has-background" style="margin-top:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--40)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|50"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"38%"} -->
<div class="wp-block-column" style="flex-basis:38%"><!-- wp:heading {"level":3,"textColor":"base"} -->
<h3 class="wp-block-heading has-base-color has-text-color">سقف الخليج للمقاولات</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"#b8c4d3"}}} -->
<p class="has-text-color" style="color:#b8c4d3">شركة مقاولات عامة نقدّم حلولاً متكاملة في الإنشاءات والتشطيبات والترميم، بجودة عالية والتزام تام بالمواعيد ومعايير السلامة.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":4,"style":{"typography":{"fontSize":"1.1rem"}},"textColor":"accent"} -->
<h4 class="wp-block-heading has-accent-color has-text-color" style="font-size:1.1rem">روابط سريعة</h4>
<!-- /wp:heading -->

<!-- wp:list {"style":{"typography":{"lineHeight":"2.1"},"spacing":{"padding":{"right":"0","left":"0"}}},"className":"is-style-default"} -->
<ul style="padding-right:0;padding-left:0;line-height:2.1;list-style:none" class="wp-block-list is-style-default"><!-- wp:list-item -->
<li><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>">من نحن</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">خدماتنا</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="<?php echo esc_url( home_url( '/projects/' ) ); ?>">مشاريعنا</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">تواصل معنا</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":4,"style":{"typography":{"fontSize":"1.1rem"}},"textColor":"accent"} -->
<h4 class="wp-block-heading has-accent-color has-text-color" style="font-size:1.1rem">خدماتنا</h4>
<!-- /wp:heading -->

<!-- wp:list {"style":{"typography":{"lineHeight":"2.1"},"spacing":{"padding":{"right":"0","left":"0"}},"color":{"text":"#b8c4d3"}}} -->
<ul style="color:#b8c4d3;padding-right:0;padding-left:0;line-height:2.1;list-style:none" class="wp-block-list has-text-color"><!-- wp:list-item -->
<li>الإنشاءات العامة</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>التشطيبات والديكور</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>الترميم والصيانة</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>الأعمال الكهروميكانيكية</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"26%"} -->
<div class="wp-block-column" style="flex-basis:26%"><!-- wp:heading {"level":4,"style":{"typography":{"fontSize":"1.1rem"}},"textColor":"accent"} -->
<h4 class="wp-block-heading has-accent-color has-text-color" style="font-size:1.1rem">تواصل معنا</h4>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"lineHeight":"2.1"},"color":{"text":"#b8c4d3"}}} -->
<p class="has-text-color" style="color:#b8c4d3;line-height:2.1"><?php echo roof_gulf_icon( 'pin', 16 ); // phpcs:ignore ?> <?php echo esc_html( roof_gulf_contact( 'address' ) ); ?><br><?php echo roof_gulf_icon( 'phone', 16 ); // phpcs:ignore ?> <a href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', roof_gulf_contact( 'phone' ) ) ); ?>"><span dir="ltr"><?php echo esc_html( roof_gulf_contact( 'phone' ) ); ?></span></a><br><?php echo roof_gulf_icon( 'mail', 16 ); // phpcs:ignore ?> <a href="mailto:<?php echo esc_attr( roof_gulf_contact( 'email' ) ); ?>"><?php echo esc_html( roof_gulf_contact( 'email' ) ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:separator {"align":"wide","style":{"color":{"background":"#23395a"},"spacing":{"margin":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|30"}}},"className":"is-style-wide"} -->
<hr class="wp-block-separator alignwide has-text-color has-alpha-channel-opacity has-background is-style-wide" style="margin-top:var(--wp--preset--spacing--50);margin-bottom:var(--wp--preset--spacing--30);background-color:#23395a;color:#23395a"/>
<!-- /wp:separator -->

<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"0.9rem"},"color":{"text":"#8798ad"}}} -->
<p class="has-text-align-center has-text-color" style="color:#8798ad;font-size:0.9rem">© <?php echo esc_html( gmdate( 'Y' ) ); ?> سقف الخليج للمقاولات — جميع الحقوق محفوظة</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
